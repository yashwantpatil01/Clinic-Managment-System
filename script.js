document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const patientForm = document.getElementById('patient-form');
    const receptionistSection = document.getElementById('receptionist-section');
    const doctorSection = document.getElementById('doctor-section');
    const patientList = document.getElementById('patient-list');
    const doctorPatientList = document.getElementById('doctor-patient-list');
    const loginError = document.getElementById('login-error');

    // Hardcoded credentials for demonstration
    const users = {
        doctor: { username: 'doctor', password: '123' },
        receptionist: { username: 'receptionist', password: '321' }
    };

    // Login and redirect based on user role
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const role = document.getElementById('user-role').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication check
        if (username === users[role].username && password === users[role].password) {
            loginError.textContent = '';
            document.getElementById('login-section').style.display = 'none';
            if (role === 'doctor') {
                doctorSection.style.display = 'block';
                displayPatientsForDoctor();
            } else {
                receptionistSection.style.display = 'block';
                displayPatients();
            }
        } else {
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
    });

    // Logout function to redirect back to the login screen
    window.logout = function() {
        receptionistSection.style.display = 'none';
        doctorSection.style.display = 'none';
        document.getElementById('login-section').style.display = 'block';
        loginForm.reset();
    };

    // Add patient form submission
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('patient-name').value;
        const age = document.getElementById('patient-age').value;
        const prescription = document.getElementById('patient-prescription').value;
        const token = generateToken();

        const patient = {
            id: Date.now(),
            token,
            name,
            age,
            prescription
        };

        addPatientToStorage(patient);
        displayPatients();
        patientForm.reset();
    });

    // Display patients in receptionist section
    function displayPatients() {
        patientList.innerHTML = '';
        const patients = getPatientsFromStorage();
        patients.forEach(patient => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="patient-details">
                    <span>Token: ${patient.token} - ${patient.name}, Age: ${patient.age}</span>
                    <div class="patient-actions">
                        <button onclick="editPatient(${patient.id})">Edit</button>
                        <button onclick="deletePatient(${patient.id})">Delete</button>
                    </div>
                </div>
                <div>Prescription: ${patient.prescription}</div>
            `;
            patientList.appendChild(li);
        });
    }

    // Display patients in doctor section
    function displayPatientsForDoctor() {
        doctorPatientList.innerHTML = '';
        const patients = getPatientsFromStorage();
        patients.forEach(patient => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="patient-details">
                    <span>Token: ${patient.token} - ${patient.name}, Age: ${patient.age}</span>
                </div>
                <div>Prescription: ${patient.prescription}</div>
            `;
            doctorPatientList.appendChild(li);
        });
    }

    // Generate a unique token number
    function generateToken() {
        return Math.floor(Math.random() * 1000);
    }

    // Add a new patient to local storage
    function addPatientToStorage(patient) {
        const patients = getPatientsFromStorage();
        patients.push(patient);
        localStorage.setItem('patients', JSON.stringify(patients));
    }

    // Retrieve all patients from local storage
    function getPatientsFromStorage() {
        return JSON.parse(localStorage.getItem('patients')) || [];
    }

    // Edit patient
    window.editPatient = function(id) {
        const patients = getPatientsFromStorage();
        const patient = patients.find(patient => patient.id === id);
        if (patient) {
            document.getElementById('patient-name').value = patient.name;
            document.getElementById('patient-age').value = patient.age;
            document.getElementById('patient-prescription').value = patient.prescription;
            deletePatient(id);
        }
    };

    // Delete patient
    window.deletePatient = function(id) {
        let patients = getPatientsFromStorage();
        patients = patients.filter(patient => patient.id !== id);
        localStorage.setItem('patients', JSON.stringify(patients));
        displayPatients();
        displayPatientsForDoctor();
    };
});
