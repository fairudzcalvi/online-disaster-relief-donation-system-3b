// Organization data - realistic information about Philippine relief organizations
const organizationData = {
    1: {
        name: 'Philippine Red Cross',
        logo: 'PRC',
        color: '#e74c3c',
        shortDescription: 'Leading humanitarian organization providing emergency relief, health services, and disaster preparedness across the Philippines since 1947.',
        fullDescription: 'The Philippine Red Cross is the premier humanitarian organization in the Philippines, operating under the principles of the International Red Cross and Red Crescent Movement. With over 75 years of dedicated service, the organization maintains the largest network of volunteers and branches nationwide, responding to disasters, providing health services, and promoting disaster preparedness in communities.',
        founded: '1947',
        headquarters: 'Port Area, Manila',
        type: 'Humanitarian Organization',
        activeCampaigns: 6,
        branchesServed: 'Nationwide (100+ chapters)',
        credentials: [
            { label: 'Legal Status', value: 'Republic Act No. 10072', icon: 'file-certificate' },
            { label: 'International Affiliation', value: 'IFRC Member', icon: 'globe' },
            { label: 'Accreditation', value: 'DSWD Accredited', icon: 'check-circle' },
            { label: 'Transparency Seal', value: 'DOH Certified', icon: 'shield-check' }
        ],
        specializations: [
            'Emergency Relief',
            'Blood Services',
            'Medical Support',
            'Disaster Response',
            'Community Preparedness',
            'First Aid Training'
        ],
        focusAreas: [
            {
                title: 'Disaster Response',
                description: 'Immediate emergency response and relief distribution during typhoons, earthquakes, and other disasters',
                icon: 'house-tsunami'
            },
            {
                title: 'Blood Services',
                description: 'Operating blood centers nationwide to ensure adequate blood supply for hospitals and emergency cases',
                icon: 'droplet'
            },
            {
                title: 'Health Services',
                description: 'Medical missions, ambulance services, and community health programs across the country',
                icon: 'heart-pulse'
            },
            {
                title: 'Safety Services',
                description: 'First aid training, water safety, and disaster preparedness education for communities',
                icon: 'life-ring'
            }
        ],
        contact: {
            website: 'www.redcross.org.ph',
            email: 'info@redcross.org.ph',
            phone: '(02) 8790-2300',
            address: 'Port Area, Manila 1018'
        }
    },
    2: {
        name: 'Caritas Philippines',
        logo: 'CP',
        color: '#3498db',
        shortDescription: 'Catholic social action network focused on integral human development and community empowerment through relief and rehabilitation programs.',
        fullDescription: 'Caritas Philippines (NASSA/Caritas Philippines) is the social action arm of the Catholic Church in the Philippines. The organization focuses on integral human development, providing relief and rehabilitation programs with emphasis on community empowerment, livelihood development, and sustainable solutions to poverty.',
        founded: '1956',
        headquarters: 'Intramuros, Manila',
        type: 'Faith-Based NGO',
        activeCampaigns: 4,
        branchesServed: 'Nationwide (86 dioceses)',
        credentials: [
            { label: 'SEC Registration', value: 'Registered NGO', icon: 'file-certificate' },
            { label: 'International Network', value: 'Caritas Internationalis', icon: 'globe' },
            { label: 'DSWD Accreditation', value: 'Accredited Partner', icon: 'check-circle' },
            { label: 'Church Mandate', value: 'CBCP Approved', icon: 'shield-check' }
        ],
        specializations: [
            'Livelihood Programs',
            'Food Security',
            'Rehabilitation',
            'Community Building',
            'Social Services',
            'Disaster Recovery'
        ],
        focusAreas: [
            {
                title: 'Livelihood Development',
                description: 'Sustainable livelihood programs helping families achieve economic independence and food security',
                icon: 'seedling'
            },
            {
                title: 'Disaster Rehabilitation',
                description: 'Long-term recovery and rebuilding programs for communities affected by disasters',
                icon: 'hammer'
            },
            {
                title: 'Social Services',
                description: 'Comprehensive social welfare programs including education, healthcare, and family support',
                icon: 'hands-holding-circle'
            },
            {
                title: 'Community Organizing',
                description: 'Building resilient communities through participatory development and empowerment programs',
                icon: 'people-group'
            }
        ],
        contact: {
            website: 'www.caritasphilippines.org',
            email: 'info@caritasphilippines.org',
            phone: '(02) 8527-5570',
            address: 'Intramuros, Manila'
        }
    },
    3: {
        name: 'Operation Blessing Philippines',
        logo: 'OB',
        color: '#27ae60',
        shortDescription: 'International relief organization committed to alleviating human suffering through hunger relief, disaster response, and community development.',
        fullDescription: 'Operation Blessing Philippines Foundation is part of the international Operation Blessing network, dedicated to alleviating human suffering and empowering communities. The organization focuses on hunger relief, disaster response, medical care, and sustainable community development programs across the Philippines.',
        founded: '1992',
        headquarters: 'Quezon City',
        type: 'International Relief Organization',
        activeCampaigns: 5,
        branchesServed: 'Multiple provinces',
        credentials: [
            { label: 'SEC Registration', value: 'Registered Foundation', icon: 'file-certificate' },
            { label: 'International Presence', value: 'Global Operations', icon: 'globe' },
            { label: 'DSWD Partner', value: 'Accredited', icon: 'check-circle' },
            { label: 'Transparency', value: 'Audited Reports', icon: 'shield-check' }
        ],
        specializations: [
            'Hunger Relief',
            'Water Projects',
            'Medical Missions',
            'Shelter Support',
            'Livelihood Training',
            'Disaster Response'
        ],
        focusAreas: [
            {
                title: 'Hunger Relief Programs',
                description: 'Feeding programs and food distribution to undernourished children and vulnerable communities',
                icon: 'bowl-food'
            },
            {
                title: 'Clean Water Projects',
                description: 'Building wells and water systems to provide clean, safe water to underserved communities',
                icon: 'faucet-drip'
            },
            {
                title: 'Medical Missions',
                description: 'Mobile clinics and medical outreach programs bringing healthcare to remote areas',
                icon: 'truck-medical'
            },
            {
                title: 'Disaster Relief',
                description: 'Rapid response and recovery assistance for communities affected by natural disasters',
                icon: 'hand-holding-heart'
            }
        ],
        contact: {
            website: 'www.obphilippines.org',
            email: 'info@obphilippines.org',
            phone: '(02) 8426-7159',
            address: 'Quezon City'
        }
    },
    4: {
        name: 'Gawad Kalinga',
        logo: 'GK',
        color: '#f39c12',
        shortDescription: 'Community development movement building homes and communities, focused on empowering families through integrated social development programs.',
        fullDescription: 'Gawad Kalinga is a Philippine-based community development organization focused on ending poverty through integrated community development. The movement builds homes and communities while providing education, livelihood, and values formation programs to empower families and create sustainable change.',
        founded: '2003',
        headquarters: 'Quezon City',
        type: 'Community Development NGO',
        activeCampaigns: 3,
        branchesServed: 'Nationwide communities',
        credentials: [
            { label: 'SEC Registration', value: 'Registered NGO', icon: 'file-certificate' },
            { label: 'Awards', value: 'Multiple recognitions', icon: 'award' },
            { label: 'DSWD Partner', value: 'Accredited', icon: 'check-circle' },
            { label: 'Community Impact', value: '3000+ villages', icon: 'shield-check' }
        ],
        specializations: [
            'Housing Programs',
            'Education Support',
            'Livelihood Development',
            'Youth Development',
            'Social Entrepreneurship',
            'Community Building'
        ],
        focusAreas: [
            {
                title: 'Housing & Shelter',
                description: 'Building homes and developing communities for families living in poverty',
                icon: 'house'
            },
            {
                title: 'Education Programs',
                description: 'Scholarship programs, school supplies, and educational support for children',
                icon: 'graduation-cap'
            },
            {
                title: 'Livelihood & Enterprise',
                description: 'Skills training and social enterprise development for sustainable income generation',
                icon: 'briefcase'
            },
            {
                title: 'Youth Empowerment',
                description: 'Leadership development and values formation programs for young people',
                icon: 'users'
            }
        ],
        contact: {
            website: 'www.gk1world.com',
            email: 'info@gk1world.com',
            phone: '(02) 8376-5009',
            address: 'Quezon City'
        }
    },
    5: {
        name: 'World Vision Philippines',
        logo: 'WV',
        color: '#e67e22',
        shortDescription: 'International Christian humanitarian organization focused on child-focused community development and emergency relief.',
        fullDescription: 'World Vision Philippines is part of the global World Vision partnership, working with children, families, and communities to overcome poverty and injustice. The organization implements long-term development programs, emergency response, and advocacy initiatives across the Philippines.',
        founded: '1957',
        headquarters: 'Quezon City',
        type: 'International NGO',
        activeCampaigns: 5,
        branchesServed: 'Multiple regions',
        credentials: [
            { label: 'SEC Registration', value: 'Registered Foundation', icon: 'file-certificate' },
            { label: 'International Network', value: 'World Vision Global', icon: 'globe' },
            { label: 'DSWD Accreditation', value: 'Accredited Partner', icon: 'check-circle' },
            { label: 'Child Focus', value: 'UNCRC Compliant', icon: 'shield-check' }
        ],
        specializations: [
            'Child Sponsorship',
            'Education',
            'Health & Nutrition',
            'Water & Sanitation',
            'Emergency Relief',
            'Livelihood'
        ],
        focusAreas: [
            {
                title: 'Child Well-being',
                description: 'Comprehensive child development programs focusing on health, education, and protection',
                icon: 'child'
            },
            {
                title: 'Education Access',
                description: 'Supporting quality education and learning opportunities for children in vulnerable communities',
                icon: 'book-open'
            },
            {
                title: 'Health & Nutrition',
                description: 'Healthcare services, nutrition programs, and health education for mothers and children',
                icon: 'heart-pulse'
            },
            {
                title: 'WASH Programs',
                description: 'Water, sanitation, and hygiene projects improving community health and well-being',
                icon: 'droplet'
            }
        ],
        contact: {
            website: 'www.worldvision.org.ph',
            email: 'info@worldvision.org.ph',
            phone: '(02) 8374-6982',
            address: 'Quezon City'
        }
    },
    6: {
        name: 'Habitat for Humanity Philippines',
        logo: 'HH',
        color: '#16a085',
        shortDescription: 'Global nonprofit housing organization working to eliminate poverty housing and homelessness through shelter solutions.',
        fullDescription: 'Habitat for Humanity Philippines brings people together to build homes, communities, and hope. The organization works alongside families in need to build and improve places to call home, believing that affordable housing plays a critical role in breaking the cycle of poverty.',
        founded: '1988',
        headquarters: 'Makati City',
        type: 'International Housing NGO',
        activeCampaigns: 4,
        branchesServed: 'Nationwide',
        credentials: [
            { label: 'SEC Registration', value: 'Registered Foundation', icon: 'file-certificate' },
            { label: 'Global Network', value: 'Habitat International', icon: 'globe' },
            { label: 'HLURB Partner', value: 'Housing Authority', icon: 'check-circle' },
            { label: 'UN Habitat', value: 'Recognized Partner', icon: 'shield-check' }
        ],
        specializations: [
            'Home Building',
            'Home Repair',
            'Disaster Response',
            'Community Development',
            'Housing Advocacy',
            'Microfinance'
        ],
        focusAreas: [
            {
                title: 'New Home Construction',
                description: 'Building decent, affordable homes for families living in inadequate shelter',
                icon: 'home'
            },
            {
                title: 'Home Improvement',
                description: 'Repairing and upgrading existing homes to make them safe and decent',
                icon: 'tools'
            },
            {
                title: 'Disaster Response',
                description: 'Rapid shelter assistance and long-term housing reconstruction after disasters',
                icon: 'house-circle-check'
            },
            {
                title: 'Community Infrastructure',
                description: 'Building water systems, sanitation facilities, and community centers',
                icon: 'city'
            }
        ],
        contact: {
            website: 'www.habitat.org.ph',
            email: 'info@habitat.org.ph',
            phone: '(02) 8843-4774',
            address: 'Makati City'
        }
    },
    7: {
        name: 'UNICEF Philippines',
        logo: 'UN',
        color: '#1e88e5',
        shortDescription: 'United Nations agency working to protect children\'s rights and provide humanitarian assistance to children and mothers.',
        fullDescription: 'UNICEF Philippines works with partners to ensure every Filipino child has the right to survive, develop, and reach their full potential. The organization provides humanitarian and development assistance to children and mothers in the Philippines, focusing on the most disadvantaged and excluded children.',
        founded: '1948',
        headquarters: 'Makati City',
        type: 'UN Agency',
        activeCampaigns: 6,
        branchesServed: 'Nationwide programs',
        credentials: [
            { label: 'Status', value: 'UN Agency', icon: 'file-certificate' },
            { label: 'Global Mandate', value: 'UN Member States', icon: 'globe' },
            { label: 'Government Partner', value: 'PH Government MOU', icon: 'check-circle' },
            { label: 'Convention', value: 'UNCRC Implementation', icon: 'shield-check' }
        ],
        specializations: [
            'Child Protection',
            'Education',
            'Health',
            'Nutrition',
            'WASH',
            'Emergency Response'
        ],
        focusAreas: [
            {
                title: 'Child Protection',
                description: 'Protecting children from violence, exploitation, abuse, and neglect',
                icon: 'shield'
            },
            {
                title: 'Education for All',
                description: 'Ensuring all children have access to quality basic education and learning opportunities',
                icon: 'school'
            },
            {
                title: 'Health & Immunization',
                description: 'Promoting child survival through immunization, maternal health, and disease prevention',
                icon: 'syringe'
            },
            {
                title: 'Nutrition Programs',
                description: 'Addressing malnutrition and promoting proper nutrition for mothers and children',
                icon: 'apple-whole'
            }
        ],
        contact: {
            website: 'www.unicef.org/philippines',
            email: 'manila@unicef.org',
            phone: '(02) 8901-0100',
            address: 'Makati City'
        }
    },
    8: {
        name: 'Save the Children Philippines',
        logo: 'SC',
        color: '#d32f2f',
        shortDescription: 'International organization working to improve the lives of children through education, healthcare, and emergency relief.',
        fullDescription: 'Save the Children Philippines is part of the world\'s leading independent organization for children, working to ensure every child has the right to survival, protection, development, and participation. The organization implements programs in education, child protection, child rights governance, humanitarian response, and child poverty.',
        founded: '1982',
        headquarters: 'Quezon City',
        type: 'International NGO',
        activeCampaigns: 5,
        branchesServed: 'Multiple provinces',
        credentials: [
            { label: 'SEC Registration', value: 'Registered Foundation', icon: 'file-certificate' },
            { label: 'International Network', value: 'Save the Children Global', icon: 'globe' },
            { label: 'DSWD Partner', value: 'Accredited', icon: 'check-circle' },
            { label: 'Child Rights', value: 'UNCRC Advocate', icon: 'shield-check' }
        ],
        specializations: [
            'Child Protection',
            'Quality Education',
            'Child Poverty',
            'Humanitarian Response',
            'Child Rights',
            'Health & Nutrition'
        ],
        focusAreas: [
            {
                title: 'Quality Education',
                description: 'Improving access to quality basic education and alternative learning programs',
                icon: 'chalkboard-user'
            },
            {
                title: 'Child Protection Systems',
                description: 'Strengthening systems to protect children from abuse, violence, and exploitation',
                icon: 'hands-holding-child'
            },
            {
                title: 'Emergency Response',
                description: 'Providing immediate humanitarian assistance to children in disasters and conflicts',
                icon: 'circle-exclamation'
            },
            {
                title: 'Child Poverty Reduction',
                description: 'Programs addressing the root causes of child poverty and deprivation',
                icon: 'hand-holding-dollar'
            }
        ],
        contact: {
            website: 'www.savethechildren.org.ph',
            email: 'info@savethechildren.org.ph',
            phone: '(02) 8843-5980',
            address: 'Quezon City'
        }
    }
};

// Render organization cards
function renderOrganizations() {
    const grid = document.getElementById('organizationsGrid');
    
    Object.keys(organizationData).forEach(id => {
        const org = organizationData[id];
        
        const card = document.createElement('div');
        card.className = 'org-card';
        card.setAttribute('data-org-id', id);
        
        card.innerHTML = `
            <div class="org-header">
                <div class="org-logo-large" style="background: ${org.color};">${org.logo}</div>
                <div class="org-info">
                    <h3 class="org-name">${org.name}</h3>
                    <span class="org-verified">
                        <i class="fas fa-check-circle"></i>
                        Verified Organization
                    </span>
                </div>
            </div>

            <p class="org-description">${org.shortDescription}</p>

            <div class="org-stats">
                <div class="org-stat-item">
                    <div class="org-stat-value">${org.activeCampaigns}</div>
                    <div class="org-stat-label">Active Campaigns</div>
                </div>
                <div class="org-stat-item">
                    <div class="org-stat-value">${org.branchesServed}</div>
                    <div class="org-stat-label">Service Coverage</div>
                </div>
            </div>

            <div class="org-specialties">
                <div class="specialties-title">Specializations</div>
                <div class="specialty-tags">
                    ${org.specializations.slice(0, 4).map(spec => 
                        `<span class="specialty-tag">${spec}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="org-actions">
                <button class="btn btn-primary btn-org view-org-btn">View Full Profile</button>
                <button class="btn btn-outline btn-org view-campaigns-btn">View Campaigns</button>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    // Add event listeners to all view buttons
    document.querySelectorAll('.view-org-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.org-card');
            const orgId = card.getAttribute('data-org-id');
            showOrganizationDetails(orgId);
        });
    });

    document.querySelectorAll('.view-campaigns-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = 'campaign.html';
        });
    });
}

// Show organization details in modal
function showOrganizationDetails(id) {
    const org = organizationData[id];
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div class="detail-section">
            <div class="org-header" style="border-bottom: none; padding-bottom: 0; margin-bottom: 16px;">
                <div class="org-logo-large" style="background: ${org.color};">${org.logo}</div>
                <div class="org-info">
                    <h3 class="org-name">${org.name}</h3>
                    <span class="org-verified">
                        <i class="fas fa-check-circle"></i>
                        Verified Organization
                    </span>
                </div>
            </div>
            <p>${org.fullDescription}</p>
        </div>

        <div class="detail-section">
            <h3>Organization Information</h3>
            <div class="credentials-grid">
                <div class="credential-item">
                    <div class="credential-icon"><i class="fas fa-calendar"></i></div>
                    <div class="credential-info">
                        <div class="credential-label">Founded</div>
                        <div class="credential-value">${org.founded}</div>
                    </div>
                </div>
                <div class="credential-item">
                    <div class="credential-icon"><i class="fas fa-building"></i></div>
                    <div class="credential-info">
                        <div class="credential-label">Headquarters</div>
                        <div class="credential-value">${org.headquarters}</div>
                    </div>
                </div>
                <div class="credential-item">
                    <div class="credential-icon"><i class="fas fa-tag"></i></div>
                    <div class="credential-info">
                        <div class="credential-label">Organization Type</div>
                        <div class="credential-value">${org.type}</div>
                    </div>
                </div>
                <div class="credential-item">
                    <div class="credential-icon"><i class="fas fa-map-marked"></i></div>
                    <div class="credential-info">
                        <div class="credential-label">Service Coverage</div>
                        <div class="credential-value">${org.branchesServed}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <h3>Credentials & Accreditation</h3>
            <div class="credentials-grid">
                ${org.credentials.map(cred => `
                    <div class="credential-item">
                        <div class="credential-icon"><i class="fas fa-${cred.icon}"></i></div>
                        <div class="credential-info">
                            <div class="credential-label">${cred.label}</div>
                            <div class="credential-value">${cred.value}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="detail-section">
            <h3>Areas of Focus</h3>
            <div class="focus-areas-list">
                ${org.focusAreas.map(area => `
                    <div class="focus-area-item">
                        <div class="focus-icon"><i class="fas fa-${area.icon}"></i></div>
                        <div class="focus-content">
                            <div class="focus-title">${area.title}</div>
                            <div class="focus-description">${area.description}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="detail-section">
            <h3>Contact Information</h3>
            <div class="contact-grid">
                <div class="contact-item">
                    <div class="contact-label"><i class="fas fa-globe"></i> Website</div>
                    <div class="contact-value">${org.contact.website}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label"><i class="fas fa-envelope"></i> Email</div>
                    <div class="contact-value">${org.contact.email}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label"><i class="fas fa-phone"></i> Phone</div>
                    <div class="contact-value">${org.contact.phone}</div>
                </div>
                <div class="contact-item">
                    <div class="contact-label"><i class="fas fa-map-marker-alt"></i> Address</div>
                    <div class="contact-value">${org.contact.address}</div>
                </div>
            </div>
        </div>

        <div class="detail-section">
            <button class="btn btn-primary" style="width: 100%;" onclick="window.location.href='campaign.html'">
                <i class="fas fa-list"></i> View All Campaigns
            </button>
        </div>
    `;
    
    document.getElementById('modalTitle').textContent = 'Organization Profile';
    document.getElementById('orgModal').classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('orgModal').classList.remove('active');
}

// Close modal when clicking outside
document.getElementById('orgModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderOrganizations();
});