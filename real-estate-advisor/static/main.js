document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Form submission
    const predictionForm = document.getElementById('prediction-form');
    const loadingIndicator = document.getElementById('loading');
    const resultsContainer = document.getElementById('results');
    const noResultsContainer = document.getElementById('no-results');
    const resultsDescription = document.getElementById('results-description');
    
    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading indicator
        loadingIndicator.classList.remove('hidden');
        resultsContainer.classList.add('hidden');
        noResultsContainer.classList.add('hidden');
        
        // Get form data
        const formData = {
            annualSalary: document.getElementById('annualSalary').value,
            bhk: document.getElementById('bhk').value,
            preferredLocation: document.getElementById('preferredLocation').value,
            city: document.getElementById('city').value
        };
        
        try {
            // Send API request
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Update results
            updateResults(data);
            
            // Hide loading indicator and show results
            loadingIndicator.classList.add('hidden');
            resultsContainer.classList.remove('hidden');
            noResultsContainer.classList.add('hidden');
            resultsDescription.textContent = 'Based on your preferences and budget';
            
        } catch (error) {
            console.error('Error:', error);
            
            // Hide loading indicator and show error message
            loadingIndicator.classList.add('hidden');
            noResultsContainer.classList.remove('hidden');
            resultsContainer.classList.add('hidden');
            resultsDescription.textContent = 'An error occurred. Please try again.';
        }
    });
    
    // Function to update results in the UI
    function updateResults(data) {
        // Update affordability meter
        const affordabilityScore = data.affordabilityScore;
        const maxBudget = data.maxBudget;
        
        document.getElementById('affordability-score').textContent = `Score: ${affordabilityScore}/10`;
        
        const progressBar = document.getElementById('affordability-progress');
        progressBar.style.width = `${affordabilityScore * 10}%`;
        
        // Set color based on score
        if (affordabilityScore >= 7) {
            progressBar.style.backgroundColor = 'var(--success-color)';
            document.getElementById('affordability-message').textContent = 'This is well within your budget';
        } else if (affordabilityScore >= 4) {
            progressBar.style.backgroundColor = 'var(--warning-color)';
            document.getElementById('affordability-message').textContent = 'This is manageable but stretches your budget';
        } else {
            progressBar.style.backgroundColor = 'var(--danger-color)';
            document.getElementById('affordability-message').textContent = 'This may be challenging for your budget';
        }
        
        // Format budget to Indian currency format
        const formattedBudget = new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(maxBudget);
        
        document.getElementById('max-budget').textContent = `Max Budget: ${formattedBudget}`;
        
        // Update price chart
        updatePriceChart(data.predictions);
        
        // Update location suggestions
        updateLocationSuggestions(data.suggestedLocations, document.getElementById('city').value);
    }
    
    // Function to update price chart
    function updatePriceChart(predictions) {
        const ctx = document.getElementById('price-chart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (window.priceChart) {
            window.priceChart.destroy();
        }
        
        const locations = predictions.map(p => p.location);
        const prices = predictions.map(p => p.price / 100000); // Convert to lakhs
        
        window.priceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: locations,
                datasets: [{
                    label: 'Price (₹ Lakhs)',
                    data: prices,
                    backgroundColor: 'rgba(79, 70, 229, 0.7)',
                    borderColor: 'rgb(79, 70, 229)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹ ${context.parsed.y.toFixed(2)} Lakhs`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Price (₹ Lakhs)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Location'
                        }
                    }
                }
            }
        });
    }
    
    // Function to update location suggestions
    function updateLocationSuggestions(locations, city) {
        const container = document.getElementById('location-suggestions');
        container.innerHTML = '';
        
        if (!locations || locations.length === 0) {
            container.innerHTML = '<p>No location suggestions available</p>';
            return;
        }
        
        locations.forEach((location, index) => {
            const isBestMatch = index === 0;
            
            const card = document.createElement('div');
            card.className = `location-card ${isBestMatch ? 'best-match' : ''}`;
            
            const header = document.createElement('div');
            header.className = 'location-header';
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'location-name';
            nameDiv.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${location.name}, ${city}
            `;
            
            header.appendChild(nameDiv);
            
            if (isBestMatch) {
                const badge = document.createElement('span');
                badge.className = 'best-match-badge';
                badge.textContent = 'Best Match';
                header.appendChild(badge);
            }
            
            const stats = document.createElement('div');
            stats.className = 'location-stats';
            
            const affordabilityStat = document.createElement('div');
            affordabilityStat.className = 'stat affordability-stat';
            affordabilityStat.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                Affordability: ${location.affordabilityScore}/10
            `;
            
            const growthStat = document.createElement('div');
            growthStat.className = 'stat growth-stat';
            growthStat.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                Growth: ${location.growthPotential}/10
            `;
            
            stats.appendChild(affordabilityStat);
            stats.appendChild(growthStat);
            
            const amenities = document.createElement('div');
            amenities.className = 'amenities';
            
            location.amenities.forEach(amenity => {
                const badge = document.createElement('span');
                badge.className = 'amenity-badge';
                badge.textContent = amenity;
                amenities.appendChild(badge);
            });
            
            card.appendChild(header);
            card.appendChild(stats);
            card.appendChild(amenities);
            
            container.appendChild(card);
        });
    }
});