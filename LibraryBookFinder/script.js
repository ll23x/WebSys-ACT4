function searchlibrarydata() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');

    // Show loading indicator
    resultsDiv.innerHTML = '';
    loadingDiv.classList.remove('d-none');

    // Fetch data from the JSON endpoint
    fetch('https://ll23x.github.io/librarybookfinder/librarydata.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            loadingDiv.classList.add('d-none');

            if (!searchTerm) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-info-circle"></i>
                        <h5>Please enter a title or author to search</h5>
                    </div>
                `;
                return;
            }

            const librarydata = Array.isArray(data) ? data : [data];

            const filteredlibrarydata = librarydata.filter(item =>
                (item.title?.toLowerCase() || '').includes(searchTerm) ||
                (item.author?.toLowerCase() || '').includes(searchTerm)
            );

            displayResults(filteredlibrarydata);
        })
        .catch(error => {
            loadingDiv.classList.add('d-none');
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-exclamation-triangle text-danger"></i>
                    <h5>Error loading data</h5>
                    <p class="text-muted">${error.message}</p>
                </div>
            `;
            console.error('Error fetching data:', error);
        });
}

function displayResults(librarydata) {
    const resultsDiv = document.getElementById('results');

    if (librarydata.length === 0) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <i class="fas fa-user-slash"></i>
                <h5>No matches found</h5>
                <p class="text-muted">Try searching for a different title or author</p>
            </div>
        `;
        return;
    }

    let html = `
        <table class="table contact-table table-hover">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
    `;

    librarydata.forEach(item => {
        // Handle "Available" and "Checked Out" based on `available` property
        const statusText = item.avalable 
            ? `<span class="text-success">Available</span>` 
            : `<span class="text-danger">Checked Out</span>`;
        
        html += `
            <tr>
                <td>${item.title || 'N/A'}</td>
                <td>${item.author || 'N/A'}</td>
                <td>${item.genre || 'N/A'}</td>
                <td>${statusText}</td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    resultsDiv.innerHTML = html;
}
