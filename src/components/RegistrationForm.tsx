import React, { useState } from 'react';
import { ArrowLeft, User, GraduationCap, Users, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const RegistrationForm: React.FC = () => {
  const [userType, setUserType] = useState<'student' | 'teacher' | 'visitor'>('student');
  const [formData, setFormData] = useState({
    // Informations personnelles
    lastname: '',
    firstname: '',
    birthdate: '',
    email: '',
    phone: '',
    address: '',
    office: '',
    
    // Informations académiques/professionnelles
    studentId: '',
    employeeId: '',
    faculty: '',
    program: '',
    studyYear: '',
    promotion: '',
    status: '',
    specialties: '',
    laboratory: '',
    
    // Informations visiteurs
    visitorStatus: '',
    organization: '',
    reason: '',
    
    // Informations de compte
    username: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    terms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { register } = useAuth();

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Validation des champs obligatoires
    if (!formData.lastname.trim()) newErrors.lastname = 'Le nom est requis';
    if (!formData.firstname.trim()) newErrors.firstname = 'Le prénom est requis';
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis';
    if (!formData.username.trim()) newErrors.username = 'Le nom d\'utilisateur est requis';
    if (!formData.password) newErrors.password = 'Le mot de passe est requis';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'La confirmation est requise';
    if (!formData.securityQuestion) newErrors.securityQuestion = 'La question de sécurité est requise';
    if (!formData.securityAnswer.trim()) newErrors.securityAnswer = 'La réponse est requise';
    if (!formData.terms) newErrors.terms = 'Vous devez accepter les conditions';

    // Validation spécifique par type d'utilisateur
    if (userType === 'student') {
      if (!formData.birthdate) newErrors.birthdate = 'La date de naissance est requise';
      if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
      if (!formData.faculty) newErrors.faculty = 'La faculté est requise';
      if (!formData.program) newErrors.program = 'La formation est requise';
      if (!formData.studyYear) newErrors.studyYear = 'L\'année d\'études est requise';
      if (!formData.promotion.trim()) newErrors.promotion = 'La promotion est requise';
    }

    if (userType === 'teacher') {
      if (!formData.birthdate) newErrors.birthdate = 'La date de naissance est requise';
      if (!formData.employeeId.trim()) newErrors.employeeId = 'Le matricule est requis';
      if (!formData.faculty) newErrors.faculty = 'Le département est requis';
      if (!formData.status) newErrors.status = 'Le statut est requis';
      if (!formData.specialties.trim()) newErrors.specialties = 'Les spécialités sont requises';
      if (!formData.office.trim()) newErrors.office = 'Le bureau est requis';
    }

    if (userType === 'visitor') {
      if (!formData.visitorStatus) newErrors.visitorStatus = 'Le statut est requis';
      if (!formData.reason.trim()) newErrors.reason = 'La raison est requise';
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation mot de passe
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        userType,
        ...formData
      });
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setErrors({ general: 'Erreur lors de l\'inscription. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      lastname: '',
      firstname: '',
      birthdate: '',
      email: '',
      phone: '',
      address: '',
      office: '',
      studentId: '',
      employeeId: '',
      faculty: '',
      program: '',
      studyYear: '',
      promotion: '',
      status: '',
      specialties: '',
      laboratory: '',
      visitorStatus: '',
      organization: '',
      reason: '',
      username: '',
      password: '',
      confirmPassword: '',
      securityQuestion: '',
      securityAnswer: '',
      terms: false
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-[#1A4B8C] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-[#1A4B8C] font-bold text-lg">E</span>
              </div>
              <span className="text-white font-bold text-lg">ESST</span>
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white hover:text-gray-200">Accueil</Link>
              <Link to="/formation" className="text-white hover:text-gray-200">Formations</Link>
              <Link to="/login" className="bg-[#FFD700] hover:bg-yellow-400 text-[#2D3748] px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Connexion
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#1A4B8C] text-white p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Inscription à la plateforme ESST</h1>
              <Link 
                to="/login" 
                className="flex items-center text-white hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour à la connexion
              </Link>
            </div>
          </div>

          <div className="p-8">
            {/* User Type Selection */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Sélectionnez votre profil
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => setUserType('student')}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    userType === 'student'
                      ? 'border-[#1A4B8C] bg-blue-50 text-[#1A4B8C]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <GraduationCap className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Étudiant</h3>
                  <p className="text-sm text-gray-600">
                    Accédez à vos cours et participez aux projets.
                  </p>
                </button>

                <button
                  onClick={() => setUserType('teacher')}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    userType === 'teacher'
                      ? 'border-[#1A4B8C] bg-blue-50 text-[#1A4B8C]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Users className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Enseignant</h3>
                  <p className="text-sm text-gray-600">
                    Gérez vos cours et communiquez avec vos étudiants.
                  </p>
                </button>

                <button
                  onClick={() => setUserType('visitor')}
                  className={`p-6 border-2 rounded-xl text-center transition-all ${
                    userType === 'visitor'
                      ? 'border-[#1A4B8C] bg-blue-50 text-[#1A4B8C]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <User className="h-12 w-12 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Visiteur</h3>
                  <p className="text-sm text-gray-600">
                    Consultez les informations publiques de l'ESST.
                  </p>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations personnelles */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-[#1A4B8C] mb-4">
                  Informations personnelles
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.lastname}
                      onChange={(e) => handleInputChange('lastname', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.lastname ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Votre nom"
                    />
                    {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.firstname}
                      onChange={(e) => handleInputChange('firstname', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.firstname ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Votre prénom"
                    />
                    {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                  </div>

                  {(userType === 'student' || userType === 'teacher') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date de naissance <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.birthdate}
                        onChange={(e) => handleInputChange('birthdate', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.birthdate ? 'border-red-300' : 'border-gray-300'
                        }`}
                      />
                      {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse e-mail <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="votre.email@esst.edu"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone {(userType === 'student' || userType === 'teacher') && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>

                  {userType === 'student' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Adresse postale <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Votre adresse"
                      />
                      {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                    </div>
                  )}

                  {userType === 'teacher' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bureau/Localisation <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.office}
                        onChange={(e) => handleInputChange('office', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.office ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Bureau A123"
                      />
                      {errors.office && <p className="text-red-500 text-xs mt-1">{errors.office}</p>}
                    </div>
                  )}
                </div>
              </div>

              {/* Informations académiques/professionnelles */}
              {(userType === 'student' || userType === 'teacher') && (
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-[#1A4B8C] mb-4">
                    {userType === 'student' ? 'Informations académiques' : 'Informations professionnelles'}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {userType === 'student' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro d'étudiant (si déjà inscrit)
                        </label>
                        <input
                          type="text"
                          value={formData.studentId}
                          onChange={(e) => handleInputChange('studentId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Numéro étudiant"
                        />
                      </div>
                    )}

                    {userType === 'teacher' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Numéro d'employé/Matricule <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.employeeId}
                          onChange={(e) => handleInputChange('employeeId', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.employeeId ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Matricule"
                        />
                        {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId}</p>}
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {userType === 'student' ? 'Faculté' : 'Département'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.faculty}
                        onChange={(e) => handleInputChange('faculty', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.faculty ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="sciences">Sciences</option>
                        <option value="tech">Technologies</option>
                        <option value="math">Mathématiques</option>
                        <option value="info">Informatique</option>
                      </select>
                      {errors.faculty && <p className="text-red-500 text-xs mt-1">{errors.faculty}</p>}
                    </div>

                    {userType === 'student' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Formation suivie <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.program}
                            onChange={(e) => handleInputChange('program', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.program ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Sélectionnez</option>
                            <option value="licence-info">Licence Informatique</option>
                            <option value="master-ia">Master Intelligence Artificielle</option>
                            <option value="master-cyber">Master Cybersécurité</option>
                            <option value="master-data">Master Data Science</option>
                          </select>
                          {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Année d'études <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.studyYear}
                            onChange={(e) => handleInputChange('studyYear', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.studyYear ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Sélectionnez</option>
                            <option value="l1">L1</option>
                            <option value="l2">L2</option>
                            <option value="l3">L3</option>
                            <option value="m1">M1</option>
                            <option value="m2">M2</option>
                            <option value="doctorat">Doctorat</option>
                          </select>
                          {errors.studyYear && <p className="text-red-500 text-xs mt-1">{errors.studyYear}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Promotion <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.promotion}
                            onChange={(e) => handleInputChange('promotion', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.promotion ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Ex: 2025-2026"
                          />
                          {errors.promotion && <p className="text-red-500 text-xs mt-1">{errors.promotion}</p>}
                        </div>
                      </>
                    )}

                    {userType === 'teacher' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.status ? 'border-red-300' : 'border-gray-300'
                            }`}
                          >
                            <option value="">Sélectionnez</option>
                            <option value="professor">Professeur</option>
                            <option value="associate">Maître de conférences</option>
                            <option value="assistant">Assistant</option>
                            <option value="temporary">Chargé de TD/TP</option>
                          </select>
                          {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Spécialités/Disciplines enseignées <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.specialties}
                            onChange={(e) => handleInputChange('specialties', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                              errors.specialties ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Ex: Intelligence Artificielle, Machine Learning"
                          />
                          {errors.specialties && <p className="text-red-500 text-xs mt-1">{errors.specialties}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Laboratoire de rattachement
                          </label>
                          <input
                            type="text"
                            value={formData.laboratory}
                            onChange={(e) => handleInputChange('laboratory', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Nom du laboratoire"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Informations visiteurs */}
              {userType === 'visitor' && (
                <div className="border-b border-gray-200 pb-6">
                  <h3 className="text-lg font-semibold text-[#1A4B8C] mb-4">
                    Informations complémentaires
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Statut <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.visitorStatus}
                        onChange={(e) => handleInputChange('visitorStatus', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.visitorStatus ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Sélectionnez</option>
                        <option value="future-student">Futur étudiant</option>
                        <option value="parent">Parent d'étudiant</option>
                        <option value="professional">Professionnel</option>
                        <option value="other">Autre</option>
                      </select>
                      {errors.visitorStatus && <p className="text-red-500 text-xs mt-1">{errors.visitorStatus}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organisation/Entreprise
                      </label>
                      <input
                        type="text"
                        value={formData.organization}
                        onChange={(e) => handleInputChange('organization', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nom de l'organisation"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Raison de l'inscription <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.reason}
                        onChange={(e) => handleInputChange('reason', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.reason ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Expliquez pourquoi vous souhaitez vous inscrire..."
                      />
                      {errors.reason && <p className="text-red-500 text-xs mt-1">{errors.reason}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Informations de compte */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-[#1A4B8C] mb-4">
                  Informations de compte
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom d'utilisateur <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nom d'utilisateur"
                    />
                    {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.password ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 8 caractères, incluant majuscules, minuscules et chiffres
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmation du mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Confirmez le mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question de sécurité <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.securityQuestion}
                      onChange={(e) => handleInputChange('securityQuestion', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.securityQuestion ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez une question</option>
                      <option value="first-pet">Quel était le nom de votre premier animal de compagnie ?</option>
                      <option value="mother-maiden">Quel est le nom de jeune fille de votre mère ?</option>
                      <option value="birth-city">Dans quelle ville êtes-vous né(e) ?</option>
                      <option value="first-school">Quel était le nom de votre première école ?</option>
                    </select>
                    {errors.securityQuestion && <p className="text-red-500 text-xs mt-1">{errors.securityQuestion}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Réponse <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.securityAnswer}
                      onChange={(e) => handleInputChange('securityAnswer', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.securityAnswer ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Votre réponse"
                    />
                    {errors.securityAnswer && <p className="text-red-500 text-xs mt-1">{errors.securityAnswer}</p>}
                  </div>
                </div>
              </div>

              {/* Terms and Submit */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      checked={formData.terms}
                      onChange={(e) => handleInputChange('terms', e.target.checked)}
                      className={`rounded border-gray-300 mt-1 mr-3 ${
                        errors.terms ? 'border-red-300' : ''
                      }`}
                    />
                    <span className="text-sm text-gray-700">
                      J'accepte les{' '}
                      <a href="#" className="text-[#1A4B8C] hover:underline">
                        conditions d'utilisation
                      </a>{' '}
                      et la{' '}
                      <a href="#" className="text-[#1A4B8C] hover:underline">
                        politique de confidentialité
                      </a>{' '}
                      <span className="text-red-500">*</span>
                    </span>
                  </label>
                  {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Réinitialiser
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-[#1A4B8C] text-white rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Inscription en cours...
                      </div>
                    ) : (
                      'S\'inscrire'
                    )}
                  </button>
                </div>
              </div>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-[#1A4B8C] hover:underline font-medium">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#1A4B8C] text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4">ESST</h4>
              <p className="text-blue-200">École Supérieure des Sciences et Technologies</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Liens utiles</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Plan du site</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <div className="text-blue-200 space-y-1">
                <p>123 Avenue des Sciences, 75000 Paris</p>
                <p>Tel: +33 1 23 45 67 89</p>
                <p>Email: contact@esst.fr</p>
              </div>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center">
            <p className="text-blue-200">© 2025 ESST. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};