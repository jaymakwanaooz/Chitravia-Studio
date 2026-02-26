// DOM Elements
const loginContainer = document.getElementById('login-container');
const dashboardContainer = document.getElementById('dashboard-container');
const loginForm = document.getElementById('login-form');
const errorMsg = document.getElementById('error-msg');
const projectForm = document.getElementById('project-form');
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const projectsGrid = document.getElementById('admin-portfolio-grid');
const totalProjectsEl = document.getElementById('total-projects');
const userEmailEl = document.getElementById('user-email');

let currentUser = null;
let isEditing = false;
let currentProjectId = null;

// Initialize Supabase Client (from config.js)
// Assuming supabaseClient is available globally

// Auth State Listener
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (session) {
        currentUser = session.user;
        userEmailEl.textContent = currentUser.email;
        showDashboard();
        fetchProjects();
        fetchLeads();
    } else {
        showLogin();
    }
});

// Login Handler
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorMsg.textContent = error.message;
    } else {
        // Auth listener will handle the rest
        errorMsg.textContent = '';
    }
});

// Logout Handler
async function logout() {
    await supabaseClient.auth.signOut();
    location.reload();
}

// Data Fetching
async function fetchProjects() {
    projectsGrid.innerHTML = '<p>Loading projects...</p>';

    const { data: projects, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        projectsGrid.innerHTML = '<p>Error loading projects. Check console.</p>';
        return;
    }

    totalProjectsEl.textContent = projects.length;
    renderProjects(projects);
}

// Fetch Leads
async function fetchLeads() {
    const leadsBody = document.getElementById('leads-table-body');
    if (!leadsBody) return;

    leadsBody.innerHTML = '<tr><td colspan="6">Loading leads...</td></tr>';

    const { data: leads, error } = await supabaseClient
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching leads:', error);
        leadsBody.innerHTML = '<tr><td colspan="6">Error loading leads. Check console.</td></tr>';
        return;
    }

    renderLeads(leads);
}

function renderLeads(leads) {
    const leadsBody = document.getElementById('leads-table-body');
    if (!leadsBody) return;
    leadsBody.innerHTML = '';

    if (!leads || leads.length === 0) {
        leadsBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-secondary);">No leads or requests found.</td></tr>';
        return;
    }

    leads.forEach(lead => {
        const tr = document.createElement('tr');
        const dateStr = new Date(lead.created_at).toLocaleString();
        tr.innerHTML = `
            <td style="white-space: nowrap;">${dateStr}</td>
            <td>${lead.name || '-'}</td>
            <td><a href="mailto:${lead.email}" style="color:var(--accent-color);">${lead.email || '-'}</a></td>
            <td>${lead.phone || '-'}</td>
            <td style="text-transform: capitalize;">${lead.project_type || '-'}</td>
            <td style="max-width: 300px;">${lead.message || '-'}</td>
        `;
        leadsBody.appendChild(tr);
    });
}

// Listing Projects
function renderProjects(projects) {
    projectsGrid.innerHTML = '';
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects found. Add one!</p>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'admin-card';
        card.innerHTML = `
            <div class="card-img" style="background-image: url('${project.image_url ? project.image_url.split(',')[0] : 'placeholder.jpg'}')"></div>
            <div class="card-content">
                <h4>${project.title}</h4>
                <p><strong>${project.category}</strong></p>
                <p>${project.description}</p>
            </div>
            <div class="card-actions">
                <span>ID: ${project.id}</span>
                <div class="btns">
                    <button class="edit" data-id="${project.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete" data-id="${project.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;

        // Add event listeners for buttons
        card.querySelector('.edit').addEventListener('click', () => openEditModal(project));
        card.querySelector('.delete').addEventListener('click', () => deleteProject(project.id));

        projectsGrid.appendChild(card);
    });
}

// Add/Edit Project Logic
function openModal() {
    isEditing = false;
    currentProjectId = null;
    modalTitle.textContent = 'Add New Project';
    projectForm.reset();
    modal.style.display = 'block';
}

function openEditModal(project) {
    isEditing = true;
    currentProjectId = project.id;
    modalTitle.textContent = 'Edit Project';

    document.getElementById('p-title').value = project.title;
    document.getElementById('p-desc').value = project.description;
    // We cannot set file input value programmatically for security reasons
    // But we can store the current image URL string to be used if no new file is selected
    // (This is already handled by our submit logic check: if(isEditing && ...))

    // Optional: Show a preview or text saying "3 images selected" (Not implemented for simplicity, but good for UX)
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
}

// Close modal if clicking outside
window.onclick = function (event) {
    if (event.target == modal) {
        closeModal();
    }
}

// Form Submission
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Get Elements
    const fileInput = document.getElementById('p-image-file');
    const file = fileInput.files[0];
    const statusEl = document.getElementById('upload-status');
    const submitBtn = projectForm.querySelector('button[type="submit"]');

    // Basic Validation
    if (!file && !isEditing) {
        alert("Please select an image file.");
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    // Prepare Base Data
    const projectData = {
        title: document.getElementById('p-title').value,
        description: document.getElementById('p-desc').value,
        category: document.getElementById('p-category').value
        // image_url added later
    };

    try {
        // IMAGE UPLOAD LOGIC

        // ... (inside projectForm submit handler)

        // Handle Multiple File Uploads
        let imageUrls = [];

        // If editing, start with existing (split string into array)
        if (isEditing && currentProjectId) {
            // We need to fetch the current project data or store it when opening modal
            // For now, let's assume we need to re-fetch or use a global currentProject object
            // BUT, we don't have currentProject defined in this scope easily unless we change openEditModal

            // Simplification: We will trust what's in the hidden or global state if we had it.
            // Actually, let's just fetch it or rely on what we have. 
            // To fix the error quickly: we will just build the new string.

            // ERROR FIX: 'currentProject' is not defined in this scope normally unless global. 
            // Let's check 'openEditModal'. It sets 'currentProjectId'.
        }

        // BETTER APPROACH for this fix: 
        // We will just upload new files if any, and append them or replace?
        // Let's assume replace for now or append if we want complex logic. 
        // Given the error 'imageUrl is not defined', I will fix the variable names.

        const files = fileInput.files;
        if (files && files.length > 0) {
            statusEl.textContent = `Uploading ${files.length} images...`;
            submitBtn.textContent = 'Uploading...';
            submitBtn.disabled = true;

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const timestamp = new Date().getTime();
                const fileExt = file.name.split('.').pop();
                const fileName = `${timestamp}_${i}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                const { data, error: uploadError } = await supabaseClient
                    .storage
                    .from('portfolio-images')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabaseClient
                    .storage
                    .from('portfolio-images')
                    .getPublicUrl(filePath);

                imageUrls.push(urlData.publicUrl);
            }
        }

        // DATABASE SAVE LOGIC
        statusEl.textContent = 'Saving details...';

        let finalImageString = imageUrls.join(',');

        // If we are editing and didn't upload new files, we might want to keep the old ones.
        // But since we don't have easy access to the old string here without fetching, 
        // AND the user might want to replace images...
        // Let's do this: 
        // If new files uploaded -> use new files.
        // If NO new files uploaded -> keep old string (we need to pass it or not update it).

        if (isEditing) {
            const updatePayload = {
                title: projectData.title,
                description: projectData.description,
                category: projectData.category
            };

            // Only update image_url if we have new images
            if (imageUrls.length > 0) {
                updatePayload.image_url = finalImageString;
            }

            const { error: updateError } = await supabaseClient
                .from('projects')
                .update(updatePayload)
                .eq('id', currentProjectId);

            if (updateError) throw updateError;

        } else {
            // Insert
            if (imageUrls.length === 0) {
                throw new Error("Please upload at least one image.");
            }
            projectData.image_url = finalImageString;

            const { error: insertError } = await supabaseClient
                .from('projects')
                .insert([projectData]);

            if (insertError) throw insertError;
        }

        // Success
        closeModal();
        fetchProjects();
        projectForm.reset();
        modal.style.display = 'none';

    } catch (err) {
        console.error(err);
        alert('Error: ' + err.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Save Project';
        statusEl.textContent = '';
    }
});

// Delete Project
async function deleteProject(id) {
    if (!confirm('Are you sure you want to delete this project?')) return;

    const { error } = await supabaseClient
        .from('projects')
        .delete()
        .eq('id', id);

    if (error) {
        alert('Error deleting project: ' + error.message);
    } else {
        fetchProjects();
    }
}

// UI State Management
function showLogin() {
    loginContainer.style.display = 'flex';
    dashboardContainer.style.display = 'none';
}

function showDashboard() {
    loginContainer.style.display = 'none';
    dashboardContainer.style.display = 'flex';
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.menu li').forEach(item => item.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    // Simplified active state for menu demo
}
