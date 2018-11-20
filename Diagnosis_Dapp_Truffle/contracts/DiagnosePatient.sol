pragma solidity ^0.4.24;


contract AIDiagnosis{
    //NOTE: Use IPFS to save images to Ethereum blockchain
    
    struct OrganizationData {
        address Address;
        bool hasPermissions;
    }
    mapping(address => OrganizationData) public organizations;
    
    bytes32[] public symptoms;
    bytes32[] public diseases;
    
    // change to PRIVATE later
    address[] public organizationAddresses;    // array of private organizations that may modify symptoms and diseases
    address public owner;   // the current organization that is able to modify the contract
    
    // adding events when symptoms and diseases are added to log them and from which organizations
    event addedSymptom (
        address indexed _from,      // indexed keyword only relevent to logged events
        bytes32 indexed _symptom
    );
    
    event addedDisease (
        address indexed _from,
        bytes32 indexed _disease
    );
    
    event addedOrganization (
        address indexed _address  
    );
    
    event changedOwnership (
        address indexed _from,
        address indexed _to
    );
    
    constructor() public {    // internal keyword will only let function be called within or from derived contracts
        require(msg.sender != address(0), "Sender address is empty");
        OrganizationData organization = organizations[msg.sender];
        organization.Address = msg.sender;
        organization.hasPermissions = true;
        owner = msg.sender;     // the owner of the contract will be the address that has deployed the contract
        organizationAddresses.push(msg.sender);
        emit addedOrganization(msg.sender);
    }
    
    function checkPermissions(address orgAddr) public view returns (bool) {
        OrganizationData organization = organizations[orgAddr];
        if(organization.hasPermissions) {
            return true;
        } else {
            return false;
        }
    }
    
    function isOwner() public view returns (bool) {     // checks if the address is the CURRENT owner of the contract
        OrganizationData organization = organizations[msg.sender];
        if (organization.Address == owner) {
            return true;
        } else {
            return false;
        }
    }
    
    modifier Owner() {      // function modifier that only allows the owner address/account to use the function
        require(isOwner() && checkPermissions(msg.sender), "Does not have permissions or have ownership");
        _;
    }
    
    function addOrganizations(address newOrgAddr) public Owner {
        require(newOrgAddr != address(0), "The entered address is empty!");
        OrganizationData organization = organizations[newOrgAddr];
        organization.Address = newOrgAddr;
        organization.hasPermissions = true;
        organizationAddresses.push(newOrgAddr);
        emit addedOrganization(newOrgAddr);
    }
    
    function transferOrgOwnership(address newOwner) public Owner {    // changes the ownership of the contract
        require(newOwner != address(0));
        owner = newOwner;
        emit changedOwnership(owner, newOwner);
    } 
    
    function addSymptoms(bytes32 symptom) public Owner {   // adding symptoms to symptoms array
        symptoms.push(symptom);
        emit addedSymptom(msg.sender, symptom);
    }
    
    
    function addDiseases(bytes32 disease) public Owner {    // adding diseases to disease array
        diseases.push(disease);
        emit addedDisease(msg.sender, disease);
    }

    
    // debug purposes
    // function checkSymptoms() view public returns (bytes32[]) {  // view keyword does not change the state at all and only reads data
    //     return symptoms;
    // }
    
    // debug purposes    
    // function checkDiseases() view public returns (bytes32[]) {
    //     return diseases;
    // }
    
    // function diagnosePatient() public {
    //     // function to diagnose patient
    // }
    
}


contract Patient {
    //AIDiagnosis diagnosis = new AIDiagnosis();
    
    // NOTES:
    // Map instead of using arrays to protect for DOS attacks
    // MAYBE SAVE PATIENT ID, AND ON DAPP SHOW PATIENT #, to ACCESS SPECIFIC PATIENTS
    
    struct PatientData {
        address Address;
        uint payment;    // patient may pay for their diagnosis (idea)
        bytes32[] symptoms;  
        // maybe add patient measurements
        uint id;
        bool isPatientRegistered;
    }
    
    
    
    uint public nextPatientId;     // unique identifier for each patients
    address[] public addrPatients;
    mapping(address => PatientData) public patients;
    
    event addedPatient (
        address indexed _address,
        uint indexed _id
    );
    
    event patientPaid (     // logs when and how much patient has paid
        address indexed _address,
        uint indexed _payment
    );
    
    function registerPatient() public {
        // require function might need to be changed for Organization address as well
        // require(patientAddress == address(0), "Patient is already registered already.");
        // If require function becomes false, then it rollbacks to previous version.
        require(msg.sender != address(0), "The address is invalid!");
        PatientData patient = patients[msg.sender];  
        patient.Address = msg.sender;    // whoever invoked this function will be the patients address
        patient.id = nextPatientId;
        patient.isPatientRegistered = true;
        addrPatients.push(msg.sender);  // adds the address to the address of patients
        emit addedPatient(msg.sender, nextPatientId);
        nextPatientId++;
    }
    
    function checkPayment(address patientAddr) public constant returns (bool hasPaid) {     // checks if patient paid for the diagnosis
        PatientData patient = patients[patientAddr];  // use of var keyword is deprecated so use actual type
        if (patient.payment != 0) {
            return hasPaid = true;
        } else {
            return hasPaid = false;
        }
    }
    
    function checkIfRegistered(address patientAddr) public constant returns (bool correctAddr) {  // checks if patient address is registered
        PatientData patient = patients[patientAddr];
        if(patient.isPatientRegistered) {
            return true;
        } else {
            return false;
        }
    }
    
    function payDiagnosis(address patientAddr) public payable {     // payable function used to receive payments (ethereum)
        require(patientAddr != address(0) && checkIfRegistered(patientAddr), "Patient address entered is not registered!");  // checks if the patient paying is the right address
        PatientData patient = patients[patientAddr];
        patient.payment += msg.value;   // adds the amount of ether sent to the function to the payment property
        emit patientPaid(msg.sender, msg.value);
    }
    
    // function findDiagnosis(address patientAddr) public {   // function to find the patient's diagnosis
    //     //require(checkPayment(patientAddr), "Patient must pay first.");  // checks if patient has paid 
    //     // PatientData patient = patients[patientAddr];
    //     // diagnosis.diagnosePatient(patient);
    // }
    
    function addPatientSymptoms(address patientAddr, bytes32 _symptom) public {    // adds ONLY 1 patient symptom (fix to add multiple)
        PatientData patient = patients[patientAddr];
        patient.symptoms.push(_symptom);
    }
    
    function totalPatients() view public returns (uint) {
        return addrPatients.length;
    }
    
}

