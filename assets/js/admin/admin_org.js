fetch('database.php')
    .then(res => res.json())
    .then(data => {
        if (data.length > 0) {
            // For example, we take the first row from database
            const org = data[0];

            // Map each field to a specific <td> by ID
            document.getElementById('org-name').textContent = org['Organization_Name'];
            document.getElementById('contact-person').textContent = org['Contact_Person'];
            document.getElementById('email-phone').textContent = org['Email / Phone'];
            document.getElementById('type').textContent = org['Type'];
            document.getElementById('contributions').textContent = org['Contributions'];
            document.getElementById('status').textContent = org['Status'];
        } else {
        }
    })
    .catch(err => console.error('Error:', err));
