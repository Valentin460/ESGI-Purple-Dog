<template>
  <div class="backoffice-dashboard">
    <div class="dashboard-container">
      <!-- En-tête -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>
            <Settings :size="36" class="title-icon" />
            Back Office - Dashboard
          </h1>
          <p class="subtitle">Gérez les paramètres de la plateforme</p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="tabs-navigation">
        <button @click="activeTab = 'dashboard'" :class="{ active: activeTab === 'dashboard' }" class="tab-btn">
          <LayoutDashboard :size="20" />
          Dashboard
        </button>
        <button @click="activeTab = 'commissions'" :class="{ active: activeTab === 'commissions' }" class="tab-btn">
          <Percent :size="20" />
          Commissions
        </button>
        <button @click="activeTab = 'formulaires'" :class="{ active: activeTab === 'formulaires' }" class="tab-btn">
          <FileText :size="20" />
          Formulaires
        </button>
        <button @click="activeTab = 'categories'" :class="{ active: activeTab === 'categories' }" class="tab-btn">
          <FolderTree :size="20" />
          Catégories
        </button>
        <button @click="activeTab = 'utilisateurs'" :class="{ active: activeTab === 'utilisateurs' }" class="tab-btn">
          <Users :size="20" />
          Utilisateurs
        </button>
        <button @click="activeTab = 'ventes'" :class="{ active: activeTab === 'ventes' }" class="tab-btn">
          <ShoppingCart :size="20" />
          Ventes
        </button>
        <button @click="activeTab = 'finance'" :class="{ active: activeTab === 'finance' }" class="tab-btn">
          <Banknote :size="20" />
          Finance
        </button>
        <button @click="activeTab = 'livraison'" :class="{ active: activeTab === 'livraison' }" class="tab-btn">
          <Truck :size="20" />
          Livraison
        </button>
        <button @click="activeTab = 'avis'" :class="{ active: activeTab === 'avis' }" class="tab-btn">
          <Star :size="20" />
          Avis
        </button>
      </div>

      <!-- Contenu des onglets -->
      <div class="tab-content">
        <!-- Onglet Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="dashboard-section">
          <div class="section-header">
            <h2>
              <LayoutDashboard :size="24" />
              Vue d'ensemble
            </h2>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <TrendingUp :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Revenus du mois</div>
                <div class="stat-value">12 450€</div>
                <div class="stat-change positive">+15.3%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <ShoppingCart :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Transactions</div>
                <div class="stat-value">1,234</div>
                <div class="stat-change positive">+8.2%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <Users :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Utilisateurs actifs</div>
                <div class="stat-value">3,456</div>
                <div class="stat-change positive">+12.1%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <Package :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Objets en vente</div>
                <div class="stat-value">876</div>
                <div class="stat-change negative">-3.4%</div>
              </div>
            </div>
          </div>

          <!-- Accès rapides -->
          <div class="quick-access">
            <h3>Accès rapides</h3>
            <div class="quick-access-grid">
              <div class="quick-access-card" @click="activeTab = 'commissions'">
                <Percent :size="32" />
                <span>Gérer les commissions</span>
              </div>
              <div class="quick-access-card" @click="activeTab = 'utilisateurs'">
                <UserCog :size="32" />
                <span>Gérer les utilisateurs</span>
              </div>
              <div class="quick-access-card" @click="activeTab = 'ventes'">
                <ShoppingCart :size="32" />
                <span>Voir les ventes</span>
              </div>
              <div class="quick-access-card" @click="activeTab = 'finance'">
                <Banknote :size="32" />
                <span>Comptabilité</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Commissions --> <!-- Onglet Commissions -->
        <div v-if="activeTab === 'commissions'" class="commissions-section">
          <div class="section-header">
            <h2>
              <Percent :size="24" />
              Gestion des Commissions
            </h2>
            <button @click="sauvegarderCommissions" class="btn-save">
              <Save :size="20" />
              Sauvegarder les modifications
            </button>
          </div>

          <!-- Sélecteur de mode de modification -->
          <div class="mode-selector">
            <div class="mode-selector-header">
              <Settings :size="20" />
              <span>Mode de modification</span>
            </div>
            <div class="mode-options">
              <label class="mode-option" :class="{ active: modeModification === 'global' }">
                <input type="radio" v-model="modeModification" value="global" />
                <div class="option-content">
                  <Globe :size="24" />
                  <div class="option-text">
                    <strong>Modification Globale</strong>
                    <span>Appliquer les mêmes taux à toutes les catégories</span>
                  </div>
                </div>
              </label>
              <label class="mode-option" :class="{ active: modeModification === 'categorie' }">
                <input type="radio" v-model="modeModification" value="categorie" />
                <div class="option-content">
                  <Package :size="24" />
                  <div class="option-text">
                    <strong>Par Catégorie</strong>
                    <span>Personnaliser les taux pour chaque catégorie</span>
                  </div>
                </div>
              </label>
            </div>

            <!-- Sélecteur de catégorie si mode catégorie -->
            <div v-if="modeModification === 'categorie'" class="category-selector">
              <label>
                <Package :size="18" />
                Sélectionner une catégorie
              </label>
              <select v-model="categorieSelectionnee" class="category-select">
                <option :value="null">-- Choisir une catégorie --</option>
                <option v-for="cat in commissionsCategories" :key="cat.id" :value="cat.id">
                  {{ cat.nom }}
                </option>
              </select>
            </div>
          </div>

          <!-- Commissions globales -->
          <div class="commissions-card global-card">
            <div class="card-header">
              <h3>
                <Globe v-if="modeModification === 'global'" :size="22" />
                <Package v-else :size="22" />
                {{ modeModification === 'global' ? 'Commissions Globales' : 'Commissions - ' + getCategorieNom() }}
              </h3>
              <span class="card-subtitle">
                {{ modeModification === 'global'
                  ? 'Taux appliqués par défaut sur toutes les transactions'
                  : 'Taux personnalisés pour cette catégorie'
                }}
              </span>
            </div>

            <div class="commissions-grid">
              <div class="commission-item">
                <label>
                  <ShoppingBag :size="18" />
                  Commission Acheteur
                </label>
                <div class="input-group">
                  <input v-model.number="tauxActuels.acheteur" type="number" step="0.1" min="0" max="100"
                    class="commission-input" @input="appliquerModification" />
                  <span class="input-suffix">%</span>
                </div>
                <p class="input-help">Exemple: Pour un achat de 1000€, l'acheteur paiera {{
                  calculerMontant(1000, tauxActuels.acheteur) }}€ de commission</p>
              </div>

              <div class="commission-item">
                <label>
                  <Store :size="18" />
                  Commission Vendeur
                </label>
                <div class="input-group">
                  <input v-model.number="tauxActuels.vendeur" type="number" step="0.1" min="0" max="100"
                    class="commission-input" @input="appliquerModification" />
                  <span class="input-suffix">%</span>
                </div>
                <p class="input-help">Exemple: Pour une vente de 1000€, le vendeur recevra {{
                  calculerMontantVendeur(1000, tauxActuels.vendeur) }}€ après commission</p>
              </div>
            </div>

            <div class="commission-total">
              <AlertCircle :size="20" />
              <span>Commission totale de la plateforme: <strong>{{
                (tauxActuels.acheteur + tauxActuels.vendeur).toFixed(2)
                  }}%</strong></span>
            </div>

            <div v-if="modeModification === 'global'" class="apply-global-warning">
              <Info :size="18" />
              <span>Ces modifications seront appliquées à toutes les catégories qui n'ont pas de taux
                personnalisés</span>
            </div>
          </div>

          <!-- Commissions par catégorie -->
          <div class="commissions-card categories-card">
            <div class="card-header">
              <h3>
                <Package :size="22" />
                Commissions par Catégorie
              </h3>
              <span class="card-subtitle">Personnalisez les taux pour chaque catégorie d'objets</span>
            </div>

            <div class="categories-list">
              <div v-for="categorie in commissionsCategories" :key="categorie.id" class="categorie-item"
                @click="selectionnerCategorie(categorie.id)">
                <div class="categorie-header">
                  <div class="categorie-info">
                    <Package :size="20" class="categorie-icon" />
                    <span class="categorie-nom">{{ categorie.nom }}</span>
                  </div>
                  <div class="categorie-badges">
                    <span v-if="categorie.personnalise" class="badge-personnalise">
                      Personnalisé
                    </span>
                    <div class="categorie-commissions-preview">
                      <span class="commission-badge acheteur">
                        <ShoppingBag :size="14" />
                        {{ categorie.commissionAcheteur }}%
                      </span>
                      <span class="commission-badge vendeur">
                        <Store :size="14" />
                        {{ categorie.commissionVendeur }}%
                      </span>
                    </div>
                    <ChevronRight :size="20" class="chevron-right" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ancienne section catégories (maintenant cachée) -->
          <div v-if="false" class="commissions-card categories-card">
            <div class="card-header">
              <h3>
                <Package :size="22" />
                Commissions par Catégorie (Ancien)
              </h3>
              <span class="card-subtitle">Personnalisez les taux pour chaque catégorie d'objets</span>
            </div>

            <div class="categories-list-old">
              <div v-for="categorie in commissionsCategories" :key="categorie.id" class="categorie-item">
                <div class="categorie-header">
                  <div class="categorie-info">
                    <Package :size="20" class="categorie-icon" />
                    <span class="categorie-nom">{{ categorie.nom }}</span>
                  </div>
                  <button @click="toggleCategorie(categorie.id)" class="btn-toggle">
                    <ChevronDown :size="20" :class="{ 'rotated': categorie.expanded }" />
                  </button>
                </div>

                <transition name="slide-down">
                  <div v-if="categorie.expanded" class="categorie-content">
                    <div class="categorie-toggle">
                      <label class="switch">
                        <input type="checkbox" v-model="categorie.personnalise" />
                        <span class="slider"></span>
                      </label>
                      <span class="toggle-label">
                        {{ categorie.personnalise ? 'Commissions personnalisées activées' :
                          'Utiliser les commissions globales' }}
                      </span>
                    </div>

                    <div v-if="categorie.personnalise" class="categorie-commissions">
                      <div class="commission-input-wrapper">
                        <label>
                          <ShoppingBag :size="16" />
                          Commission Acheteur
                        </label>
                        <div class="input-group">
                          <input v-model.number="categorie.commissionAcheteur" type="number" step="0.1" min="0"
                            max="100" class="commission-input" />
                          <span class="input-suffix">%</span>
                        </div>
                      </div>

                      <div class="commission-input-wrapper">
                        <label>
                          <Store :size="16" />
                          Commission Vendeur
                        </label>
                        <div class="input-group">
                          <input v-model.number="categorie.commissionVendeur" type="number" step="0.1" min="0" max="100"
                            class="commission-input" />
                          <span class="input-suffix">%</span>
                        </div>
                      </div>
                    </div>

                    <div v-else class="categorie-default">
                      <Info :size="18" />
                      <span>Cette catégorie utilise les commissions globales: <strong>{{
                        commissionsGlobales.acheteur }}% (acheteur)</strong> + <strong>{{
                            commissionsGlobales.vendeur }}% (vendeur)</strong></span>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Prévisualisation -->
          <div class="commissions-card preview-card">
            <div class="card-header">
              <h3>
                <Calculator :size="22" />
                Simulateur de Commission
              </h3>
              <span class="card-subtitle">Testez vos taux de commission</span>
            </div>

            <div class="simulator">
              <div class="simulator-inputs">
                <div class="input-wrapper">
                  <label>Montant de la transaction</label>
                  <div class="input-group">
                    <input v-model.number="simulateur.montant" type="number" step="10" min="0"
                      class="simulator-input" />
                    <span class="input-suffix">€</span>
                  </div>
                </div>

                <div class="input-wrapper">
                  <label>Catégorie</label>
                  <select v-model="simulateur.categorieId" class="simulator-select">
                    <option :value="null">Commissions globales</option>
                    <option v-for="cat in commissionsCategories" :key="cat.id" :value="cat.id">
                      {{ cat.nom }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="simulator-results">
                <div class="result-item acheteur">
                  <div class="result-label">
                    <ShoppingBag :size="18" />
                    Commission Acheteur
                  </div>
                  <div class="result-value">{{ simulateur.commissionAcheteur }}€</div>
                  <div class="result-percentage">({{ simulateur.tauxAcheteur }}%)</div>
                </div>

                <div class="result-item vendeur">
                  <div class="result-label">
                    <Store :size="18" />
                    Commission Vendeur
                  </div>
                  <div class="result-value">{{ simulateur.commissionVendeur }}€</div>
                  <div class="result-percentage">({{ simulateur.tauxVendeur }}%)</div>
                </div>

                <div class="result-item total">
                  <div class="result-label">
                    <Wallet :size="18" />
                    Total Plateforme
                  </div>
                  <div class="result-value">{{ simulateur.totalPlateforme }}€</div>
                  <div class="result-percentage">({{ simulateur.tauxTotal }}%)</div>
                </div>

                <div class="result-summary">
                  <div class="summary-row">
                    <span>L'acheteur paiera:</span>
                    <strong>{{ simulateur.totalAcheteur }}€</strong>
                  </div>
                  <div class="summary-row">
                    <span>Le vendeur recevra:</span>
                    <strong>{{ simulateur.totalVendeur }}€</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Formulaires -->
        <div v-if="activeTab === 'formulaires'" class="formulaires-section">
          <div class="section-header">
            <h2>
              <FileText :size="24" />
              Gestion des Formulaires de Publication
            </h2>
            <button @click="sauvegarderFormulaire" class="btn-save">
              <Save :size="20" />
              Sauvegarder les modifications
            </button>
          </div>

          <!-- Sélecteur de catégorie pour formulaire -->
          <div class="form-category-selector">
            <div class="selector-header">
              <h3>
                <FolderTree :size="20" />
                Configurer le formulaire par catégorie
              </h3>
              <p class="selector-description">Chaque catégorie peut avoir son propre formulaire personnalisé</p>
            </div>

            <div class="category-selector-controls">
              <div class="selector-mode">
                <label class="radio-label">
                  <input type="radio" value="global" v-model="modeFormulaireConfig" name="formMode" />
                  <div class="radio-content">
                    <Globe :size="20" />
                    <div>
                      <strong>Formulaire global</strong>
                      <span>Appliqué à toutes les catégories</span>
                    </div>
                  </div>
                </label>
                <label class="radio-label">
                  <input type="radio" value="categorie" v-model="modeFormulaireConfig" name="formMode" />
                  <div class="radio-content">
                    <FolderTree :size="20" />
                    <div>
                      <strong>Par catégorie</strong>
                      <span>Formulaire spécifique par catégorie</span>
                    </div>
                  </div>
                </label>
              </div>

              <div v-if="modeFormulaireConfig === 'categorie'" class="category-dropdown">
                <label>Sélectionner une catégorie :</label>
                <select v-model="categorieFormulaireSelectionnee" class="category-select">
                  <option :value="null">-- Choisir une catégorie --</option>
                  <option v-for="cat in categoriesDisponibles" :key="cat.id" :value="cat.id">
                    {{ cat.nom }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Aperçu de la catégorie sélectionnée -->
            <div v-if="modeFormulaireConfig === 'categorie' && categorieFormulaireSelectionnee"
              class="selected-category-badge">
              <span class="badge-label">Configuration active pour :</span>
              <span class="badge-category">{{ getCategorieFormulaireNom() }}</span>
            </div>
          </div>

          <!-- Configuration des champs du formulaire -->
          <div class="form-config-card">
            <div class="card-header">
              <h3>
                <Settings :size="22" />
                Configuration des champs
              </h3>
              <div class="header-actions">
                <span class="card-subtitle">Personnalisez les champs du formulaire de dépôt d'objets</span>
                <button @click="openAddFieldModal" class="btn-add-field">
                  <Plus :size="18" />
                  Ajouter un champ personnalisé
                </button>
              </div>
            </div>

            <div class="fields-list">
              <!-- Champs personnalisés ajoutés -->
              <div v-for="field in champsPersonnalises" :key="field.id" class="field-item custom-field">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="field.actif" class="field-checkbox" />
                    <component :is="getFieldIcon(field.type)" :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">{{ field.label }}</span>
                      <span class="field-type">{{ getFieldTypeName(field.type) }} - Personnalisé</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="field.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand(field.id)" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields[field.id] }" />
                    </button>
                    <button @click="supprimerChamp(field.id)" class="btn-delete" title="Supprimer ce champ">
                      <Trash2 :size="18" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields[field.id]" class="field-config">
                    <div class="config-row">
                      <label>Label du champ</label>
                      <input v-model="field.label" type="text" class="config-input" />
                    </div>
                    <div class="config-row">
                      <label>Placeholder</label>
                      <input v-model="field.placeholder" type="text" class="config-input" />
                    </div>
                    <div v-if="field.aide !== undefined" class="config-row">
                      <label>Texte d'aide</label>
                      <input v-model="field.aide" type="text" class="config-input" />
                    </div>
                  </div>
                </transition>
              </div>
              <!-- Champ Nom -->
              <div class="field-item default-field">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.nom.actif" class="field-checkbox" />
                    <Type :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Nom de l'objet</span>
                      <span class="field-type">Texte court - Système</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.nom.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('nom')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.nom }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.nom" class="field-config">
                    <div class="config-row">
                      <label>Placeholder</label>
                      <input v-model="formulaireConfig.nom.placeholder" type="text" class="config-input"
                        placeholder="Ex: Vase Art Déco en cristal" />
                    </div>
                    <div class="config-row">
                      <label>Aide</label>
                      <input v-model="formulaireConfig.nom.aide" type="text" class="config-input"
                        placeholder="Texte d'aide pour l'utilisateur" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Description -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.description.actif" class="field-checkbox" />
                    <AlignLeft :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Description</span>
                      <span class="field-type">Texte long</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.description.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('description')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.description }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.description" class="field-config">
                    <div class="config-row">
                      <label>Placeholder</label>
                      <input v-model="formulaireConfig.description.placeholder" type="text" class="config-input"
                        placeholder="Ex: Décrivez votre objet en détail..." />
                    </div>
                    <div class="config-row">
                      <label>Nombre de caractères min</label>
                      <input v-model.number="formulaireConfig.description.minLength" type="number" class="config-input"
                        min="0" />
                    </div>
                    <div class="config-row">
                      <label>Nombre de caractères max</label>
                      <input v-model.number="formulaireConfig.description.maxLength" type="number" class="config-input"
                        min="0" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Catégorie -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.categorie.actif" class="field-checkbox" />
                    <FolderTree :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Catégorie</span>
                      <span class="field-type">Sélection</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.categorie.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('categorie')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.categorie }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.categorie" class="field-config">
                    <div class="config-row">
                      <label>Texte du label</label>
                      <input v-model="formulaireConfig.categorie.label" type="text" class="config-input" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Photos -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.photos.actif" class="field-checkbox" />
                    <Image :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Photos</span>
                      <span class="field-type">Upload fichier</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.photos.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('photos')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.photos }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.photos" class="field-config">
                    <div class="config-row">
                      <label>Nombre minimum de photos</label>
                      <input v-model.number="formulaireConfig.photos.min" type="number" class="config-input" min="0" />
                    </div>
                    <div class="config-row">
                      <label>Nombre maximum de photos</label>
                      <input v-model.number="formulaireConfig.photos.max" type="number" class="config-input" min="1" />
                    </div>
                    <div class="config-row">
                      <label>Taille max par photo (Mo)</label>
                      <input v-model.number="formulaireConfig.photos.maxSize" type="number" class="config-input"
                        min="1" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Type de vente -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.typeVente.actif" class="field-checkbox" />
                    <ShoppingCart :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Type de vente</span>
                      <span class="field-type">Choix multiple</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.typeVente.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('typeVente')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.typeVente }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.typeVente" class="field-config">
                    <div class="config-row checkbox-group">
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="formulaireConfig.typeVente.options.enchere" />
                        <span>Enchères</span>
                      </label>
                      <label class="checkbox-label">
                        <input type="checkbox" v-model="formulaireConfig.typeVente.options.venteRapide" />
                        <span>Vente rapide</span>
                      </label>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Prix de départ / Prix -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.prix.actif" class="field-checkbox" />
                    <Banknote :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Prix / Prix de départ</span>
                      <span class="field-type">Nombre</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.prix.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('prix')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.prix }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.prix" class="field-config">
                    <div class="config-row">
                      <label>Prix minimum autorisé (€)</label>
                      <input v-model.number="formulaireConfig.prix.min" type="number" class="config-input" min="0" />
                    </div>
                    <div class="config-row">
                      <label>Prix maximum autorisé (€)</label>
                      <input v-model.number="formulaireConfig.prix.max" type="number" class="config-input" min="0" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ Date d'expiration -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.dateExpiration.actif" class="field-checkbox" />
                    <Calendar :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">Date d'expiration</span>
                      <span class="field-type">Date</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.dateExpiration.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('dateExpiration')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.dateExpiration }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.dateExpiration" class="field-config">
                    <div class="config-row">
                      <label>Jours minimum avant expiration</label>
                      <input v-model.number="formulaireConfig.dateExpiration.minDays" type="number" class="config-input"
                        min="1" />
                    </div>
                    <div class="config-row">
                      <label>Jours maximum avant expiration</label>
                      <input v-model.number="formulaireConfig.dateExpiration.maxDays" type="number" class="config-input"
                        min="1" />
                    </div>
                  </div>
                </transition>
              </div>

              <!-- Champ État de l'objet -->
              <div class="field-item">
                <div class="field-header">
                  <div class="field-info">
                    <input type="checkbox" v-model="formulaireConfig.etat.actif" class="field-checkbox" />
                    <CheckCircle :size="20" class="field-icon" />
                    <div class="field-details">
                      <span class="field-label">État de l'objet</span>
                      <span class="field-type">Sélection</span>
                    </div>
                  </div>
                  <div class="field-controls">
                    <label class="required-toggle">
                      <input type="checkbox" v-model="formulaireConfig.etat.obligatoire" />
                      <span>Obligatoire</span>
                    </label>
                    <button @click="toggleFieldExpand('etat')" class="btn-expand">
                      <ChevronDown :size="18" :class="{ 'rotated': expandedFields.etat }" />
                    </button>
                  </div>
                </div>
                <transition name="slide-down">
                  <div v-if="expandedFields.etat" class="field-config">
                    <div class="config-row">
                      <label>Options disponibles (séparées par des virgules)</label>
                      <input v-model="formulaireConfig.etat.options" type="text" class="config-input"
                        placeholder="Ex: Neuf, Excellent, Bon, Acceptable" />
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>

          <!-- Modal d'ajout de champ -->
          <div v-if="showAddFieldModal" class="modal-overlay" @click="closeAddFieldModal">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h3>
                  <Plus :size="24" />
                  Ajouter un champ personnalisé
                </h3>
                <button @click="closeAddFieldModal" class="btn-close">
                  <X :size="24" />
                </button>
              </div>

              <div class="modal-body">
                <div class="form-group">
                  <label>Type de champ</label>
                  <select v-model="nouveauChamp.type" class="form-select">
                    <option value="text">Texte court</option>
                    <option value="textarea">Texte long</option>
                    <option value="number">Nombre</option>
                    <option value="select">Sélection</option>
                    <option value="date">Date</option>
                    <option value="checkbox">Case à cocher</option>
                    <option value="radio">Choix multiple</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Label du champ</label>
                  <input v-model="nouveauChamp.label" type="text" class="form-input" placeholder="Ex: Provenance" />
                </div>

                <div class="form-group">
                  <label>Placeholder</label>
                  <input v-model="nouveauChamp.placeholder" type="text" class="form-input"
                    placeholder="Ex: Indiquez la provenance de l'objet" />
                </div>

                <div class="form-group">
                  <label>Texte d'aide (optionnel)</label>
                  <input v-model="nouveauChamp.aide" type="text" class="form-input"
                    placeholder="Ex: Pays ou région d'origine" />
                </div>

                <div v-if="nouveauChamp.type === 'select' || nouveauChamp.type === 'radio'" class="form-group">
                  <label>Options (séparées par des virgules)</label>
                  <input v-model="nouveauChamp.options" type="text" class="form-input"
                    placeholder="Ex: France, Italie, Espagne" />
                </div>

                <div class="form-group checkbox-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="nouveauChamp.obligatoire" />
                    <span>Champ obligatoire</span>
                  </label>
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="nouveauChamp.actif" />
                    <span>Champ actif par défaut</span>
                  </label>
                </div>
              </div>

              <div class="modal-footer">
                <button @click="closeAddFieldModal" class="btn-cancel">
                  Annuler
                </button>
                <button @click="ajouterChamp" class="btn-confirm" :disabled="!nouveauChamp.label">
                  <Plus :size="18" />
                  Ajouter le champ
                </button>
              </div>
            </div>
          </div>

          <!-- Aperçu du formulaire -->
          <div class="form-preview-card">
            <div class="card-header">
              <h3>
                <Eye :size="22" />
                Aperçu du formulaire
              </h3>
              <span class="card-subtitle">Visualisez les modifications en temps réel</span>
            </div>

            <div class="preview-content">
              <div v-if="formulaireConfig.nom.actif" class="preview-field">
                <label>
                  {{ formulaireConfig.nom.label || 'Nom de l\'objet' }}
                  <span v-if="formulaireConfig.nom.obligatoire" class="required-star">*</span>
                </label>
                <input type="text" :placeholder="formulaireConfig.nom.placeholder" class="preview-input" disabled />
                <span v-if="formulaireConfig.nom.aide" class="preview-help">{{ formulaireConfig.nom.aide }}</span>
              </div>

              <div v-if="formulaireConfig.description.actif" class="preview-field">
                <label>
                  {{ formulaireConfig.description.label || 'Description' }}
                  <span v-if="formulaireConfig.description.obligatoire" class="required-star">*</span>
                </label>
                <textarea :placeholder="formulaireConfig.description.placeholder" class="preview-textarea" rows="4"
                  disabled></textarea>
              </div>

              <div v-if="formulaireConfig.categorie.actif" class="preview-field">
                <label>
                  {{ formulaireConfig.categorie.label || 'Catégorie' }}
                  <span v-if="formulaireConfig.categorie.obligatoire" class="required-star">*</span>
                </label>
                <select class="preview-select" disabled>
                  <option>Sélectionnez une catégorie</option>
                </select>
              </div>

              <div v-if="formulaireConfig.photos.actif" class="preview-field">
                <label>
                  Photos ({{ formulaireConfig.photos.min }}-{{ formulaireConfig.photos.max }})
                  <span v-if="formulaireConfig.photos.obligatoire" class="required-star">*</span>
                </label>
                <div class="preview-upload">
                  <Image :size="32" />
                  <span>Cliquez pour ajouter des photos</span>
                </div>
              </div>

              <div v-if="formulaireConfig.typeVente.actif" class="preview-field">
                <label>
                  Type de vente
                  <span v-if="formulaireConfig.typeVente.obligatoire" class="required-star">*</span>
                </label>
                <div class="preview-radio-group">
                  <label v-if="formulaireConfig.typeVente.options.enchere" class="preview-radio">
                    <input type="radio" name="type" disabled />
                    <span>Enchères</span>
                  </label>
                  <label v-if="formulaireConfig.typeVente.options.venteRapide" class="preview-radio">
                    <input type="radio" name="type" disabled />
                    <span>Vente rapide</span>
                  </label>
                </div>
              </div>

              <!-- Champs personnalisés dans l'aperçu -->
              <div v-for="field in champsPersonnalises.filter(f => f.actif)" :key="field.id" class="preview-field">
                <label>
                  {{ field.label }}
                  <span v-if="field.obligatoire" class="required-star">*</span>
                </label>
                <input v-if="field.type === 'text' || field.type === 'number' || field.type === 'date'"
                  :type="field.type" :placeholder="field.placeholder" class="preview-input" disabled />
                <textarea v-else-if="field.type === 'textarea'" :placeholder="field.placeholder"
                  class="preview-textarea" rows="3" disabled></textarea>
                <select v-else-if="field.type === 'select'" class="preview-select" disabled>
                  <option>{{ field.placeholder || 'Sélectionnez une option' }}</option>
                </select>
                <div v-else-if="field.type === 'checkbox'" class="preview-checkbox">
                  <input type="checkbox" disabled />
                  <span>{{ field.placeholder }}</span>
                </div>
                <span v-if="field.aide" class="preview-help">{{ field.aide }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Catégories -->
        <div v-if="activeTab === 'categories'" class="categories-section">
          <div class="section-header">
            <h2>
              <FolderTree :size="24" />
              Gestion des Catégories
            </h2>
            <button @click="openCategoryModal()" class="btn-save">
              <Plus :size="20" />
              Ajouter une catégorie
            </button>
          </div>

          <!-- Liste des catégories -->
          <div class="categories-list">
            <div v-for="category in categories" :key="category.id" class="category-item">
              <div class="category-info">
                <component :is="category.icon" :size="24" class="category-icon" />
                <div class="category-details">
                  <h3>{{ category.name }}</h3>
                  <p>{{ category.description }}</p>
                </div>
              </div>
              <div class="category-actions">
                <button @click="openCategoryModal(category)" class="btn-icon edit">
                  <Edit2 :size="18" />
                </button>
                <button @click="deleteCategory(category.id)" class="btn-icon delete">
                  <Trash2 :size="18" />
                </button>
              </div>
            </div>
          </div>

          <!-- Modal d'ajout/modification de catégorie -->
          <div v-if="showCategoryModal" class="modal-overlay" @click.self="closeCategoryModal">
            <div class="modal-content">
              <div class="modal-header">
                <h3>{{ editingCategory ? 'Modifier' : 'Ajouter' }} une catégorie</h3>
                <button @click="closeCategoryModal" class="btn-close">
                  <X :size="24" />
                </button>
              </div>
              <div class="modal-body">
                <div class="form-group">
                  <label>Nom de la catégorie</label>
                  <input v-model="categoryForm.name" type="text" placeholder="Ex: Bijoux, Meubles, Art..."
                    class="form-input" />
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea v-model="categoryForm.description" placeholder="Description de la catégorie"
                    class="form-textarea" rows="3"></textarea>
                </div>
                <div class="form-group">
                  <label>Icône</label>
                  <select v-model="categoryForm.iconName" class="form-select">
                    <option value="Gem">Gem (Bijoux)</option>
                    <option value="Sofa">Sofa (Meubles)</option>
                    <option value="Palette">Palette (Art)</option>
                    <option value="Library">Library (Collection)</option>
                    <option value="Music">Music (Musique)</option>
                    <option value="Shirt">Shirt (Mode)</option>
                    <option value="Hammer">Hammer (Sculpture)</option>
                    <option value="Watch">Watch (Horlogerie)</option>
                    <option value="Book">Book (Livres)</option>
                    <option value="MoreHorizontal">MoreHorizontal (Autres)</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button @click="closeCategoryModal" class="btn-secondary">
                  Annuler
                </button>
                <button @click="saveCategory" class="btn-primary">
                  <Save :size="18" />
                  {{ editingCategory ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Utilisateurs -->
        <div v-if="activeTab === 'utilisateurs'" class="utilisateurs-section">
          <div class="section-header">
            <h2>
              <Users :size="24" />
              Gestion des Utilisateurs
            </h2>
            <button @click="openUserModal()" class="btn-save">
              <Plus :size="20" />
              Créer un accès
            </button>
          </div>

          <div class="users-filters">
            <div class="filter-tabs">
              <button @click="userFilter = 'tous'" :class="{ active: userFilter === 'tous' }" class="filter-tab">
                Tous ({{ filteredUsers.length }})
              </button>
              <button @click="userFilter = 'particuliers'" :class="{ active: userFilter === 'particuliers' }"
                class="filter-tab">
                Particuliers ({{users.filter(u => u.type === 'particulier').length}})
              </button>
              <button @click="userFilter = 'professionnels'" :class="{ active: userFilter === 'professionnels' }"
                class="filter-tab">
                Professionnels ({{users.filter(u => u.type === 'professionnel').length}})
              </button>
              <button @click="userFilter = 'bloques'" :class="{ active: userFilter === 'bloques' }" class="filter-tab">
                Bloqués ({{users.filter(u => u.blocked).length}})
              </button>
            </div>
          </div>

          <!-- Liste des utilisateurs -->
          <div class="users-list">
            <div v-for="user in filteredUsers" :key="user.id" class="user-item">
              <div class="user-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.firstname" class="avatar-img" />
                <User v-else :size="24" />
              </div>
              <div class="user-info">
                <h3>{{ user.firstname }} {{ user.lastname }}</h3>
                <p>{{ user.email }}</p>
                <div class="user-badges">
                  <span :class="['badge-type', user.type]">
                    {{ user.type === 'particulier' ? 'Particulier' : 'Professionnel' }}
                  </span>
                  <span v-if="user.blocked" class="badge-status blocked">Bloqué</span>
                  <span v-else class="badge-status active">Actif</span>
                </div>
              </div>
              <div class="user-stats">
                <div class="stat-item">
                  <span class="stat-label">Objets vendus</span>
                  <span class="stat-value">{{ user.itemsSold }}</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Membre depuis</span>
                  <span class="stat-value">{{ user.memberSince }}</span>
                </div>
              </div>
              <div class="user-actions">
                <button @click="openUserModal(user)" class="btn-action btn-action-edit">
                  <Edit2 :size="18" />
                  <span>Modifier</span>
                </button>
                <button @click="toggleUserBlock(user.id)"
                  :class="['btn-action', 'btn-action-block', user.blocked ? 'unblock' : 'block']">
                  <component :is="user.blocked ? 'Unlock' : 'Lock'" :size="18" />
                  <span>{{ user.blocked ? 'Débloquer' : 'Bloquer' }}</span>
                </button>
                <button @click="deleteUser(user.id)" class="btn-action btn-action-delete">
                  <Trash2 :size="18" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal de création/modification d'utilisateur -->
          <div v-if="showUserModal" class="modal-overlay" @click.self="closeUserModal">
            <div class="modal-content">
              <div class="modal-header">
                <h3>{{ editingUser ? 'Modifier' : 'Créer' }} un accès utilisateur</h3>
                <button @click="closeUserModal" class="btn-close">
                  <X :size="24" />
                </button>
              </div>
              <div class="modal-body">
                <div class="form-row">
                  <div class="form-group">
                    <label>Prénom</label>
                    <input v-model="userForm.firstname" type="text" placeholder="Prénom" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Nom</label>
                    <input v-model="userForm.lastname" type="text" placeholder="Nom" class="form-input" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Email</label>
                  <input v-model="userForm.email" type="email" placeholder="exemple@email.com" class="form-input" />
                </div>
                <div v-if="!editingUser" class="form-group">
                  <label>Mot de passe</label>
                  <input v-model="userForm.password" type="password" placeholder="Mot de passe" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Type de compte</label>
                  <select v-model="userForm.type" class="form-select">
                    <option value="particulier">Particulier</option>
                    <option value="professionnel">Professionnel</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="checkbox-label">
                    <input v-model="userForm.blocked" type="checkbox" class="form-checkbox" />
                    <span>Bloquer cet utilisateur</span>
                  </label>
                </div>
              </div>
              <div class="modal-footer">
                <button @click="closeUserModal" class="btn-secondary">
                  Annuler
                </button>
                <button @click="saveUser" class="btn-primary">
                  <Save :size="18" />
                  {{ editingUser ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Ventes -->
        <div v-if="activeTab === 'ventes'" class="ventes-section">
          <div class="section-header">
            <h2>
              <ShoppingCart :size="24" />
              Gestion des Ventes
            </h2>
          </div>

          <div class="ventes-filters">
            <div class="filter-tabs">
              <button @click="venteFilter = 'toutes'" :class="{ active: venteFilter === 'toutes' }" class="filter-tab">
                Toutes ({{ ventesStats.toutes }})
              </button>
              <button @click="venteFilter = 'encheres-cours'" :class="{ active: venteFilter === 'encheres-cours' }"
                class="filter-tab">
                <Gavel :size="16" />
                Enchères en cours ({{ ventesStats.encheresEnCours }})
              </button>
              <button @click="venteFilter = 'encheres-terminees'"
                :class="{ active: venteFilter === 'encheres-terminees' }" class="filter-tab">
                <Gavel :size="16" />
                Enchères terminées ({{ ventesStats.encheresTerminees }})
              </button>
              <button @click="venteFilter = 'ventes-rapides'" :class="{ active: venteFilter === 'ventes-rapides' }"
                class="filter-tab">
                <Zap :size="16" />
                Ventes rapides ({{ ventesStats.ventesRapides }})
              </button>
            </div>
          </div>

          <!-- Liste des ventes -->
          <div class="ventes-list">
            <div v-for="vente in filteredVentes" :key="vente.id" class="vente-item">
              <div class="vente-image">
                <img :src="vente.image" :alt="vente.titre" />
                <span :class="['vente-badge', vente.type]">
                  <Gavel v-if="vente.type === 'enchere'" :size="14" />
                  <Zap v-else :size="14" />
                  {{ vente.type === 'enchere' ? 'Enchère' : 'Vente rapide' }}
                </span>
                <span v-if="vente.statut === 'terminee' || vente.statut === 'vendue'" class="vente-status terminee">
                  {{ vente.statut === 'terminee' ? 'Terminée' : 'Vendue' }}
                </span>
                <span v-else class="vente-status en-cours">En cours</span>
              </div>

              <div class="vente-content">
                <div class="vente-header">
                  <h3>{{ vente.titre }}</h3>
                  <span class="vente-categorie">{{ vente.categorie }}</span>
                </div>

                <div class="vente-details">
                  <div class="detail-row">
                    <span class="label">Vendeur:</span>
                    <span class="value">{{ vente.vendeur }}</span>
                  </div>

                  <div v-if="vente.type === 'enchere'" class="detail-row">
                    <span class="label">Prix de départ:</span>
                    <span class="value">{{ vente.prixDepart }}€</span>
                  </div>

                  <div class="detail-row">
                    <span class="label">
                      {{ vente.type === 'enchere'
                        ? (vente.statut === 'terminee' ? 'Prix final:' : 'Prix actuel:')
                        : 'Prix:' }}
                    </span>
                    <span class="value price">
                      {{ vente.type === 'enchere'
                        ? (vente.statut === 'terminee' ? vente.prixFinal : vente.prixActuel)
                        : vente.prix }}€
                    </span>
                  </div>

                  <div v-if="vente.type === 'enchere' && vente.nombreEncheres" class="detail-row">
                    <span class="label">Enchères:</span>
                    <span class="value">{{ vente.nombreEncheres }}</span>
                  </div>

                  <div v-if="vente.type === 'enchere' && vente.statut === 'en_cours'" class="detail-row">
                    <span class="label">Temps restant:</span>
                    <span class="value highlight">{{ vente.tempsRestant }}</span>
                  </div>

                  <div v-if="vente.type === 'vente_rapide' && vente.vues" class="detail-row">
                    <span class="label">Vues:</span>
                    <span class="value">{{ vente.vues }}</span>
                  </div>

                  <div v-if="vente.acheteur" class="detail-row">
                    <span class="label">Acheteur:</span>
                    <span class="value">{{ vente.acheteur }}</span>
                  </div>

                  <div class="detail-row">
                    <span class="label">
                      {{ vente.statut === 'terminee' || vente.statut === 'vendue'
                        ? 'Date de fin:'
                        : (vente.type === 'enchere' ? 'Début:' : 'Publication:') }}
                    </span>
                    <span class="value">
                      {{ vente.statut === 'terminee'
                        ? vente.dateFin
                        : (vente.type === 'enchere' ? vente.dateDebut : vente.datePublication) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="vente-actions">
                <button class="btn-action btn-action-view">
                  <Eye :size="18" />
                  <span>Voir</span>
                </button>
                <button class="btn-action btn-action-edit">
                  <Edit2 :size="18" />
                  <span>Modifier</span>
                </button>
                <button class="btn-action btn-action-delete">
                  <Trash2 :size="18" />
                  <span>Supprimer</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Finance -->
        <div v-if="activeTab === 'finance'" class="finance-section">
          <div class="section-header">
            <h2>
              <Banknote :size="24" />
              Gestion Financière
            </h2>
          </div>

          <!-- Stats financières -->
          <div class="finance-stats-grid">
            <div class="finance-stat-card">
              <div class="stat-icon-finance">
                <TrendingUp :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Total des ventes</span>
                <span class="stat-value-finance">{{ statsFinance.totalVentes.toLocaleString('fr-FR') }}€</span>
              </div>
            </div>
            <div class="finance-stat-card">
              <div class="stat-icon-finance commissions">
                <Percent :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Commissions perçues</span>
                <span class="stat-value-finance">{{ statsFinance.totalCommissions.toLocaleString('fr-FR') }}€</span>
              </div>
            </div>
            <div class="finance-stat-card">
              <div class="stat-icon-finance transactions">
                <ShoppingCart :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Transactions</span>
                <span class="stat-value-finance">{{ statsFinance.nombreTransactions }}</span>
              </div>
            </div>
            <div class="finance-stat-card">
              <div class="stat-icon-finance moyenne">
                <Calculator :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Montant moyen</span>
                <span class="stat-value-finance">{{ statsFinance.montantMoyen.toLocaleString('fr-FR') }}€</span>
              </div>
            </div>
          </div>

          <!-- Tabs Comptabilité et Stripe -->
          <div class="finance-tabs">
            <div class="finance-tabs-nav">
              <button @click="financeSubTab = 'comptabilite'" :class="{ active: financeSubTab === 'comptabilite' }"
                class="finance-tab-btn">
                <Calculator :size="20" />
                Comptabilité
              </button>
              <button @click="financeSubTab = 'stripe'" :class="{ active: financeSubTab === 'stripe' }"
                class="finance-tab-btn">
                <CreditCard :size="20" />
                Gestion Stripe
              </button>
            </div>

            <!-- Comptabilité -->
            <div v-if="financeSubTab === 'comptabilite'" class="comptabilite-content">
              <div class="comptabilite-header">
                <h3>Transactions et rapports</h3>
                <div class="comptabilite-actions">
                  <button class="btn-primary">
                    <FileText :size="18" />
                    Exporter CSV
                  </button>
                  <button class="btn-secondary">
                    <Calculator :size="18" />
                    Générer rapport
                  </button>
                </div>
              </div>

              <!-- Filtres transactions -->
              <div class="transactions-filters">
                <button @click="financeFilter = 'toutes'" :class="{ active: financeFilter === 'toutes' }"
                  class="filter-tab">
                  Toutes ({{ transactions.length }})
                </button>
                <button @click="financeFilter = 'ventes'" :class="{ active: financeFilter === 'ventes' }"
                  class="filter-tab">
                  Ventes ({{transactions.filter(t => t.type === 'vente').length}})
                </button>
                <button @click="financeFilter = 'remboursements'"
                  :class="{ active: financeFilter === 'remboursements' }" class="filter-tab">
                  Remboursements ({{transactions.filter(t => t.type === 'remboursement').length}})
                </button>
                <button @click="financeFilter = 'en-attente'" :class="{ active: financeFilter === 'en-attente' }"
                  class="filter-tab">
                  En attente ({{transactions.filter(t => t.statut === 'pending').length}})
                </button>
              </div>

              <!-- Liste des transactions -->
              <div class="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID Transaction</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Description</th>
                      <th>Vendeur</th>
                      <th>Acheteur</th>
                      <th>Montant</th>
                      <th>Commission</th>
                      <th>Net</th>
                      <th>Statut</th>
                      <th>Paiement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="transaction in filteredTransactions" :key="transaction.id"
                      :class="{ negative: transaction.montant < 0 }">
                      <td><span class="transaction-id">{{ transaction.id }}</span></td>
                      <td>{{ transaction.date }}</td>
                      <td>
                        <span :class="['type-badge', transaction.type]">
                          {{ transaction.type === 'vente' ? 'Vente' : 'Remboursement' }}
                        </span>
                      </td>
                      <td class="description">{{ transaction.description }}</td>
                      <td>{{ transaction.vendeur }}</td>
                      <td>{{ transaction.acheteur }}</td>
                      <td
                        :class="{ 'amount-positive': transaction.montant > 0, 'amount-negative': transaction.montant < 0 }">
                        {{ transaction.montant.toLocaleString('fr-FR') }}€
                      </td>
                      <td>{{ transaction.commission.toLocaleString('fr-FR') }}€</td>
                      <td class="net-amount">{{ transaction.montantNet.toLocaleString('fr-FR') }}€</td>
                      <td>
                        <span :class="['statut-badge', transaction.statut]">
                          {{ transaction.statut === 'completed' ? 'Complété' : 'En attente' }}
                        </span>
                      </td>
                      <td>
                        <span class="payment-method">
                          <CreditCard :size="14" />
                          Stripe
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Gestion Stripe -->
            <div v-if="financeSubTab === 'stripe'" class="stripe-content">
              <div class="stripe-header">
                <h3>Configuration Stripe</h3>
                <span :class="['stripe-mode-badge', stripeConfig.mode]">
                  Mode {{ stripeConfig.mode === 'test' ? 'Test' : 'Production' }}
                </span>
              </div>

              <div class="stripe-config-grid">
                <!-- Configuration API -->
                <div class="config-section">
                  <h4>
                    <CreditCard :size="20" />
                    Clés API
                  </h4>
                  <div class="config-group">
                    <label>Clé secrète (Secret Key)</label>
                    <div class="input-with-icon">
                      <input type="password" :value="stripeConfig.apiKey" readonly class="config-input-stripe" />
                      <button class="btn-copy">
                        <Eye :size="16" />
                      </button>
                    </div>
                  </div>
                  <div class="config-group">
                    <label>Clé publique (Publishable Key)</label>
                    <div class="input-with-icon">
                      <input type="text" :value="stripeConfig.publicKey" readonly class="config-input-stripe" />
                      <button class="btn-copy">
                        <Eye :size="16" />
                      </button>
                    </div>
                  </div>
                  <div class="config-group">
                    <label>Webhook Secret</label>
                    <div class="input-with-icon">
                      <input type="password" :value="stripeConfig.webhookSecret" readonly class="config-input-stripe" />
                      <button class="btn-copy">
                        <Eye :size="16" />
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Paramètres -->
                <div class="config-section">
                  <h4>
                    <Settings :size="20" />
                    Paramètres
                  </h4>
                  <div class="config-group">
                    <label>Mode de fonctionnement</label>
                    <select v-model="stripeConfig.mode" class="config-input-stripe">
                      <option value="test">Test</option>
                      <option value="production">Production</option>
                    </select>
                  </div>
                  <div class="config-group">
                    <label class="checkbox-label-stripe">
                      <input type="checkbox" v-model="stripeConfig.commissionsActivees" />
                      <span>Prélèvement automatique des commissions</span>
                    </label>
                  </div>
                  <div class="config-group">
                    <label class="checkbox-label-stripe">
                      <input type="checkbox" v-model="stripeConfig.payoutsAutomatiques" />
                      <span>Virements automatiques aux vendeurs</span>
                    </label>
                  </div>
                  <div class="config-group">
                    <label>Délai avant virement (jours)</label>
                    <input type="number" v-model.number="stripeConfig.delaiPayout" min="0" max="30"
                      class="config-input-stripe" />
                  </div>
                </div>

                <!-- Statistiques Stripe -->
                <div class="config-section">
                  <h4>
                    <TrendingUp :size="20" />
                    Statistiques ce mois
                  </h4>
                  <div class="stripe-stats">
                    <div class="stripe-stat-item">
                      <span class="stripe-stat-label">Paiements réussis</span>
                      <span class="stripe-stat-value">124</span>
                    </div>
                    <div class="stripe-stat-item">
                      <span class="stripe-stat-label">Paiements échoués</span>
                      <span class="stripe-stat-value error">3</span>
                    </div>
                    <div class="stripe-stat-item">
                      <span class="stripe-stat-label">Remboursements</span>
                      <span class="stripe-stat-value">1</span>
                    </div>
                    <div class="stripe-stat-item">
                      <span class="stripe-stat-label">Volume traité</span>
                      <span class="stripe-stat-value">45 230€</span>
                    </div>
                    <div class="stripe-stat-item">
                      <span class="stripe-stat-label">Frais Stripe</span>
                      <span class="stripe-stat-value">1 045€</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="config-section">
                  <h4>
                    <Settings :size="20" />
                    Actions rapides
                  </h4>
                  <div class="stripe-actions">
                    <button class="btn-stripe-action">
                      <CreditCard :size="18" />
                      Ouvrir le dashboard Stripe
                    </button>
                    <button class="btn-stripe-action">
                      <FileText :size="18" />
                      Télécharger les rapports
                    </button>
                    <button class="btn-stripe-action">
                      <Settings :size="18" />
                      Configurer les webhooks
                    </button>
                    <button class="btn-stripe-action save">
                      <Save :size="18" />
                      Sauvegarder la configuration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Livraison -->
        <div v-if="activeTab === 'livraison'" class="livraison-section">
          <div class="section-header">
            <h2>
              <Truck :size="24" />
              Gestion des Livraisons
            </h2>
          </div>

          <!-- Stats livraisons -->
          <div class="livraison-stats-grid">
            <div class="livraison-stat-card">
              <div class="stat-icon-livraison">
                <Package :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Total livraisons</span>
                <span class="stat-value-finance">{{ livraisonsStats.toutes }}</span>
              </div>
            </div>
            <div class="livraison-stat-card">
              <div class="stat-icon-livraison preparation">
                <Settings :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">En préparation</span>
                <span class="stat-value-finance">{{ livraisonsStats.enPreparation }}</span>
              </div>
            </div>
            <div class="livraison-stat-card">
              <div class="stat-icon-livraison transit">
                <Truck :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">En transit</span>
                <span class="stat-value-finance">{{ livraisonsStats.enTransit }}</span>
              </div>
            </div>
            <div class="livraison-stat-card">
              <div class="stat-icon-livraison livree">
                <CheckCircle :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Livrées</span>
                <span class="stat-value-finance">{{ livraisonsStats.livrees }}</span>
              </div>
            </div>
            <div class="livraison-stat-card">
              <div class="stat-icon-livraison incident">
                <AlertCircle :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Incidents</span>
                <span class="stat-value-finance">{{ livraisonsStats.incidents }}</span>
              </div>
            </div>
          </div>

          <!-- Tabs Livraisons et Transporteurs -->
          <div class="livraison-tabs">
            <div class="livraison-tabs-nav">
              <button @click="livraisonSubTab = 'suivi'" :class="{ active: livraisonSubTab === 'suivi' }"
                class="finance-tab-btn">
                <Truck :size="20" />
                Suivi des livraisons
              </button>
              <button @click="livraisonSubTab = 'transporteurs'"
                :class="{ active: livraisonSubTab === 'transporteurs' }" class="finance-tab-btn">
                <Settings :size="20" />
                Transporteurs
              </button>
            </div>

            <!-- Suivi des livraisons -->
            <div v-if="livraisonSubTab === 'suivi'" class="suivi-content">
              <!-- Filtres -->
              <div class="livraison-filters">
                <button @click="livraisonFilter = 'toutes'" :class="{ active: livraisonFilter === 'toutes' }"
                  class="filter-tab">
                  Toutes ({{ livraisonsStats.toutes }})
                </button>
                <button @click="livraisonFilter = 'en_preparation'"
                  :class="{ active: livraisonFilter === 'en_preparation' }" class="filter-tab">
                  En préparation ({{ livraisonsStats.enPreparation }})
                </button>
                <button @click="livraisonFilter = 'en_transit'" :class="{ active: livraisonFilter === 'en_transit' }"
                  class="filter-tab">
                  En transit ({{ livraisonsStats.enTransit }})
                </button>
                <button @click="livraisonFilter = 'livre'" :class="{ active: livraisonFilter === 'livre' }"
                  class="filter-tab">
                  Livrées ({{ livraisonsStats.livrees }})
                </button>
                <button @click="livraisonFilter = 'incident'" :class="{ active: livraisonFilter === 'incident' }"
                  class="filter-tab">
                  Incidents ({{ livraisonsStats.incidents }})
                </button>
              </div>

              <!-- Liste des livraisons -->
              <div class="livraisons-list">
                <div v-for="livraison in filteredLivraisons" :key="livraison.id" class="livraison-item">
                  <div class="livraison-header-card">
                    <div class="livraison-main-info">
                      <div class="livraison-id-status">
                        <span class="livraison-id">{{ livraison.id }}</span>
                        <span :class="['livraison-statut', livraison.statut]">
                          <Package v-if="livraison.statut === 'en_preparation'" :size="14" />
                          <Truck v-if="livraison.statut === 'en_transit'" :size="14" />
                          <CheckCircle v-if="livraison.statut === 'livre'" :size="14" />
                          <AlertCircle v-if="livraison.statut === 'incident'" :size="14" />
                          {{ livraison.statut === 'en_preparation' ? 'En préparation' :
                            livraison.statut === 'en_transit' ? 'En transit' :
                              livraison.statut === 'livre' ? 'Livré' : 'Incident' }}
                        </span>
                      </div>
                      <div class="transporteur-badge">
                        <span class="transporteur-logo">{{transporteurs.find(t => t.id ===
                          livraison.transporteur)?.logo}}</span>
                        <span>{{ livraison.nomTransporteur }}</span>
                      </div>
                    </div>
                    <div class="livraison-tracking">
                      <span class="tracking-label">N° de suivi:</span>
                      <span class="tracking-number">{{ livraison.numeroSuivi }}</span>
                    </div>
                  </div>

                  <div class="livraison-details-grid">
                    <div class="livraison-col">
                      <h4>Article</h4>
                      <p class="article-name">{{ livraison.article }}</p>
                      <div class="detail-row-small">
                        <span class="label-small">Poids:</span>
                        <span class="value-small">{{ livraison.poids }} kg</span>
                      </div>
                      <div class="detail-row-small">
                        <span class="label-small">Prix livraison:</span>
                        <span class="value-small">{{ livraison.prix }}€</span>
                      </div>
                    </div>

                    <div class="livraison-col">
                      <h4>Expéditeur</h4>
                      <p>{{ livraison.vendeur }}</p>
                      <h4 style="margin-top: 0.75rem;">Destinataire</h4>
                      <p>{{ livraison.acheteur }}</p>
                      <p class="adresse-small">{{ livraison.adresse }}</p>
                    </div>

                    <div class="livraison-col">
                      <h4>Dates</h4>
                      <div class="detail-row-small">
                        <span class="label-small">Création:</span>
                        <span class="value-small">{{ livraison.dateCreation }}</span>
                      </div>
                      <div class="detail-row-small">
                        <span class="label-small">Enlèvement:</span>
                        <span class="value-small">{{ livraison.dateEnlevement }}</span>
                      </div>
                      <div class="detail-row-small">
                        <span class="label-small">Livraison prévue:</span>
                        <span class="value-small">{{ livraison.dateLivraisonPrevue }}</span>
                      </div>
                      <div v-if="livraison.dateLivraison" class="detail-row-small">
                        <span class="label-small">Livré le:</span>
                        <span class="value-small highlight">{{ livraison.dateLivraison }}</span>
                      </div>
                    </div>

                    <div class="livraison-col">
                      <h4>Suivi</h4>
                      <div class="tracking-steps">
                        <div v-for="(etape, index) in livraison.etapes" :key="index" class="tracking-step">
                          <div class="step-marker"></div>
                          <div class="step-content">
                            <div class="step-date">{{ etape.date }}</div>
                            <div class="step-lieu">{{ etape.lieu }}</div>
                            <div class="step-description">{{ etape.description }}</div>
                          </div>
                        </div>
                      </div>
                      <div v-if="livraison.incident" class="incident-alert">
                        <AlertCircle :size="16" />
                        <span>{{ livraison.incident }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gestion des transporteurs -->
            <div v-if="livraisonSubTab === 'transporteurs'" class="transporteurs-content">
              <div class="transporteurs-grid">
                <div v-for="transporteur in transporteurs" :key="transporteur.id" class="transporteur-card">
                  <div class="transporteur-header">
                    <div class="transporteur-title">
                      <span class="transporteur-logo-big">{{ transporteur.logo }}</span>
                      <div>
                        <h3>{{ transporteur.nom }}</h3>
                        <span :class="['transporteur-status', transporteur.actif ? 'actif' : 'inactif']">
                          {{ transporteur.actif ? 'Actif' : 'Inactif' }}
                        </span>
                      </div>
                    </div>
                    <label class="switch">
                      <input type="checkbox" v-model="transporteur.actif" />
                      <span class="slider"></span>
                    </label>
                  </div>

                  <div class="transporteur-info">
                    <div class="info-row">
                      <span class="info-label">Délai de livraison:</span>
                      <span class="info-value">{{ transporteur.delaiMin }}-{{ transporteur.delaiMax }} jours</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Poids maximum:</span>
                      <span class="info-value">{{ transporteur.poidsMax }} kg</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Suivi temps réel:</span>
                      <span class="info-value">{{ transporteur.suiviTempsReel ? '✓ Oui' : '✗ Non' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Livraison à domicile:</span>
                      <span class="info-value">{{ transporteur.livraisonDomicile ? '✓ Oui' : '✗ Non' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Point relais:</span>
                      <span class="info-value">{{ transporteur.pointRelais ? '✓ Oui' : '✗ Non' }}</span>
                    </div>
                    <div class="info-row">
                      <span class="info-label">Assurance:</span>
                      <span class="info-value">{{ transporteur.assurance ? '✓ Oui' : '✗ Non' }}</span>
                    </div>
                  </div>

                  <div class="transporteur-tarifs">
                    <h4>Grille tarifaire</h4>
                    <div class="tarifs-list">
                      <div v-for="(tarif, index) in transporteur.tarifs" :key="index" class="tarif-row">
                        <span class="tarif-poids">Jusqu'à {{ tarif.poidsMax }} kg</span>
                        <span class="tarif-prix">{{ tarif.prix }}€</span>
                      </div>
                    </div>
                  </div>

                  <div class="transporteur-actions">
                    <button class="btn-transporteur-config">
                      <Settings :size="16" />
                      Configurer
                    </button>
                    <button class="btn-transporteur-stats">
                      <TrendingUp :size="16" />
                      Statistiques
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Avis -->
        <div v-if="activeTab === 'avis'" class="avis-section">
          <div class="section-header">
            <h2>
              <Star :size="24" />
              Gestion des Avis
            </h2>
          </div>

          <!-- Stats avis -->
          <div class="avis-stats-grid">
            <div class="avis-stat-card">
              <div class="stat-icon-avis">
                <Star :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Note moyenne</span>
                <span class="stat-value-finance">{{ avisStats.moyenneNotes }}/5</span>
              </div>
            </div>
            <div class="avis-stat-card">
              <div class="stat-icon-avis total">
                <Package :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Total avis</span>
                <span class="stat-value-finance">{{ avisStats.total }}</span>
              </div>
            </div>
            <div class="avis-stat-card">
              <div class="stat-icon-avis particuliers">
                <User :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Particuliers</span>
                <span class="stat-value-finance">{{ avisStats.particuliers }}</span>
              </div>
            </div>
            <div class="avis-stat-card">
              <div class="stat-icon-avis professionnels">
                <Store :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Professionnels</span>
                <span class="stat-value-finance">{{ avisStats.professionnels }}</span>
              </div>
            </div>
            <div class="avis-stat-card">
              <div class="stat-icon-avis signales">
                <AlertCircle :size="28" />
              </div>
              <div class="stat-info">
                <span class="stat-label-finance">Signalés</span>
                <span class="stat-value-finance">{{ avisStats.signales }}</span>
              </div>
            </div>
          </div>

          <!-- Répartition des notes -->
          <div class="notes-distribution">
            <h3>Répartition des notes</h3>
            <div class="notes-bars">
              <div class="note-bar-item">
                <span class="note-label">5 étoiles</span>
                <div class="note-bar-container">
                  <div class="note-bar" :style="{ width: (avisStats.note5 / avisStats.total * 100) + '%' }"></div>
                </div>
                <span class="note-count">{{ avisStats.note5 }}</span>
              </div>
              <div class="note-bar-item">
                <span class="note-label">4 étoiles</span>
                <div class="note-bar-container">
                  <div class="note-bar" :style="{ width: (avisStats.note4 / avisStats.total * 100) + '%' }"></div>
                </div>
                <span class="note-count">{{ avisStats.note4 }}</span>
              </div>
              <div class="note-bar-item">
                <span class="note-label">3 étoiles</span>
                <div class="note-bar-container">
                  <div class="note-bar" :style="{ width: (avisStats.note3 / avisStats.total * 100) + '%' }"></div>
                </div>
                <span class="note-count">{{ avisStats.note3 }}</span>
              </div>
              <div class="note-bar-item">
                <span class="note-label">2 étoiles</span>
                <div class="note-bar-container">
                  <div class="note-bar warning" :style="{ width: (avisStats.note2 / avisStats.total * 100) + '%' }">
                  </div>
                </div>
                <span class="note-count">{{ avisStats.note2 }}</span>
              </div>
              <div class="note-bar-item">
                <span class="note-label">1 étoile</span>
                <div class="note-bar-container">
                  <div class="note-bar danger" :style="{ width: (avisStats.note1 / avisStats.total * 100) + '%' }">
                  </div>
                </div>
                <span class="note-count">{{ avisStats.note1 }}</span>
              </div>
            </div>
          </div>

          <!-- Filtres -->
          <div class="avis-filters">
            <div class="filter-tabs">
              <button @click="avisFilter = 'tous'" :class="{ active: avisFilter === 'tous' }" class="filter-tab">
                Tous ({{ avisStats.total }})
              </button>
              <button @click="avisFilter = 'particuliers'" :class="{ active: avisFilter === 'particuliers' }"
                class="filter-tab">
                <User :size="16" />
                Particuliers ({{ avisStats.particuliers }})
              </button>
              <button @click="avisFilter = 'professionnels'" :class="{ active: avisFilter === 'professionnels' }"
                class="filter-tab">
                <Store :size="16" />
                Professionnels ({{ avisStats.professionnels }})
              </button>
              <button @click="avisFilter = 'signales'" :class="{ active: avisFilter === 'signales' }"
                class="filter-tab">
                <AlertCircle :size="16" />
                Signalés ({{ avisStats.signales }})
              </button>
              <button @click="avisFilter = 'en_attente'" :class="{ active: avisFilter === 'en_attente' }"
                class="filter-tab">
                <Settings :size="16" />
                En attente ({{ avisStats.enAttente }})
              </button>
            </div>
          </div>

          <!-- Liste des avis -->
          <div class="avis-list">
            <div v-for="avisItem in filteredAvis" :key="avisItem.id" class="avis-card">
              <div class="avis-header">
                <div class="avis-user-info">
                  <img :src="avisItem.avatar" :alt="avisItem.auteur" class="avis-avatar" />
                  <div class="avis-user-details">
                    <div class="avis-user-name">
                      <span>{{ avisItem.auteur }}</span>
                      <span :class="['type-badge-avis', avisItem.typeAuteur]">
                        <User v-if="avisItem.typeAuteur === 'particulier'" :size="12" />
                        <Store v-else :size="12" />
                        {{ avisItem.typeAuteur === 'particulier' ? 'Particulier' : 'Professionnel' }}
                      </span>
                    </div>
                    <div class="avis-meta">
                      <span class="avis-date">{{ avisItem.date }}</span>
                      <span class="separator">•</span>
                      <span class="avis-transaction">{{ avisItem.transaction }}</span>
                      <span v-if="avisItem.verificationAchat" class="verification-badge">
                        <CheckCircle :size="14" />
                        Achat vérifié
                      </span>
                    </div>
                  </div>
                </div>
                <div class="avis-header-actions">
                  <div class="avis-rating">
                    <Star v-for="i in 5" :key="i" :size="18" :class="{ filled: i <= avisItem.note }"
                      :fill="i <= avisItem.note ? '#fbbf24' : 'none'"
                      :stroke="i <= avisItem.note ? '#fbbf24' : '#d1d5db'" />
                  </div>
                  <span :class="['avis-statut-badge', avisItem.statut]">
                    {{ avisItem.statut === 'publie' ? 'Publié' : 'En attente' }}
                  </span>
                  <span v-if="avisItem.signale" class="signale-badge">
                    <AlertCircle :size="14" />
                    Signalé
                  </span>
                </div>
              </div>

              <div class="avis-body">
                <h4 class="avis-titre">{{ avisItem.titre }}</h4>
                <p class="avis-commentaire">{{ avisItem.commentaire }}</p>

                <div v-if="avisItem.signale" class="avis-signalement">
                  <AlertCircle :size="16" />
                  <span><strong>Motif du signalement:</strong> {{ avisItem.motifSignalement }}</span>
                </div>

                <div class="avis-destinataire">
                  <span class="label-dest">Avis concernant:</span>
                  <span class="dest-name">{{ avisItem.destinataire }}</span>
                  <span :class="['type-badge-avis-small', avisItem.typeDestinataire]">
                    {{ avisItem.typeDestinataire === 'particulier' ? 'Particulier' : 'Professionnel' }}
                  </span>
                </div>

                <div v-if="avisItem.reponse" class="avis-reponse">
                  <div class="reponse-header">
                    <span class="reponse-label">Réponse du vendeur</span>
                    <span class="reponse-date">{{ avisItem.reponse.date }}</span>
                  </div>
                  <p class="reponse-texte">{{ avisItem.reponse.texte }}</p>
                </div>
              </div>

              <div class="avis-actions">
                <button class="btn-avis-action approve" v-if="avisItem.statut === 'en_attente'">
                  <CheckCircle :size="16" />
                  Approuver
                </button>
                <button class="btn-avis-action reject" v-if="avisItem.statut === 'en_attente'">
                  <X :size="16" />
                  Rejeter
                </button>
                <button class="btn-avis-action view">
                  <Eye :size="16" />
                  Détails
                </button>
                <button class="btn-avis-action delete">
                  <Trash2 :size="16" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Statistiques (ancien) -->
        <div v-if="activeTab === 'stats'" class="stats-section">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">
                <TrendingUp :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Revenus du mois</div>
                <div class="stat-value">12 450€</div>
                <div class="stat-change positive">+15.3%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <ShoppingCart :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Transactions</div>
                <div class="stat-value">1,234</div>
                <div class="stat-change positive">+8.2%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <Users :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Utilisateurs actifs</div>
                <div class="stat-value">3,456</div>
                <div class="stat-change positive">+12.1%</div>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">
                <Package :size="32" />
              </div>
              <div class="stat-content">
                <div class="stat-label">Objets en vente</div>
                <div class="stat-value">876</div>
                <div class="stat-change negative">-3.4%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de confirmation -->
    <transition name="toast">
      <div v-if="showToast" class="toast" :class="toastType">
        <CheckCircle v-if="toastType === 'success'" :size="20" />
        <AlertCircle v-else :size="20" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  Settings,
  Percent,
  TrendingUp,
  Users,
  Save,
  Globe,
  ShoppingBag,
  Store,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Info,
  Calculator,
  Wallet,
  CheckCircle,
  ShoppingCart,
  LayoutDashboard,
  FileText,
  FolderTree,
  Banknote,
  Truck,
  Star,
  UserCog,
  Plus,
  Gavel,
  Zap,
  CreditCard,
  Type,
  AlignLeft,
  Image,
  Calendar,
  Eye,
  X,
  Trash2,
  Hash,
  ToggleLeft,
  Edit2,
  Gem,
  Sofa,
  Palette,
  Library,
  Music,
  Shirt,
  Hammer,
  Watch,
  Book,
  MoreHorizontal,
  User,
  Lock,
  Unlock
} from 'lucide-vue-next'

// État
const activeTab = ref('dashboard')
const financeSubTab = ref('comptabilite')
const livraisonSubTab = ref('suivi')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const modeModification = ref('global')
const categorieSelectionnee = ref(null)

// Données du graphique de revenus
const revenueData = ref([
  { name: 'Jan', revenue: 5800, commission: 870 },
  { name: 'Fév', revenue: 6500, commission: 975 },
  { name: 'Mar', revenue: 7200, commission: 1080 },
  { name: 'Avr', revenue: 6300, commission: 945 },
  { name: 'Mai', revenue: 7800, commission: 1170 },
  { name: 'Jun', revenue: 8500, commission: 1275 },
  { name: 'Jul', revenue: 8000, commission: 1200 },
  { name: 'Aoû', revenue: 8900, commission: 1335 },
  { name: 'Sep', revenue: 8300, commission: 1245 },
  { name: 'Oct', revenue: 9400, commission: 1410 },
  { name: 'Nov', revenue: 9800, commission: 1470 },
  { name: 'Déc', revenue: 9100, commission: 1365 }
])

const totalRevenue = computed(() => {
  return revenueData.value.reduce((sum, month) => sum + month.revenue, 0)
})

const totalCommissions = computed(() => {
  return revenueData.value.reduce((sum, month) => sum + month.commission, 0)
})

// Gestion des catégories
const showCategoryModal = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  description: '',
  iconName: 'Gem'
})

const iconComponents = {
  Gem,
  Sofa,
  Palette,
  Library,
  Music,
  Shirt,
  Hammer,
  Watch,
  Book,
  MoreHorizontal
}

const categories = ref([
  {
    id: 1,
    name: 'Bijoux',
    description: 'Bijoux précieux et de collection',
    icon: Gem,
    iconName: 'Gem',
    itemCount: 245
  },
  {
    id: 2,
    name: 'Meubles',
    description: 'Meubles anciens et design',
    icon: Sofa,
    iconName: 'Sofa',
    itemCount: 182
  },
  {
    id: 3,
    name: 'Art',
    description: 'Œuvres d\'art et tableaux',
    icon: Palette,
    iconName: 'Palette',
    itemCount: 316
  },
  {
    id: 4,
    name: 'Collection',
    description: 'Objets de collection divers',
    icon: Library,
    iconName: 'Library',
    itemCount: 489
  },
  {
    id: 5,
    name: 'Musique',
    description: 'Instruments et objets musicaux',
    icon: Music,
    iconName: 'Music',
    itemCount: 98
  },
  {
    id: 6,
    name: 'Mode',
    description: 'Vêtements et accessoires vintage',
    icon: Shirt,
    iconName: 'Shirt',
    itemCount: 154
  },
  {
    id: 7,
    name: 'Sculpture',
    description: 'Sculptures et objets sculptés',
    icon: Hammer,
    iconName: 'Hammer',
    itemCount: 75
  },
  {
    id: 8,
    name: 'Horlogerie',
    description: 'Montres et horloges anciennes',
    icon: Watch,
    iconName: 'Watch',
    itemCount: 123
  },
  {
    id: 9,
    name: 'Livres Rares',
    description: 'Livres anciens et manuscrits',
    icon: Book,
    iconName: 'Book',
    itemCount: 210
  },
  {
    id: 10,
    name: 'Autres',
    description: 'Autres objets de valeur',
    icon: MoreHorizontal,
    iconName: 'MoreHorizontal',
    itemCount: 567
  }
])

// Gestion des utilisateurs
const showUserModal = ref(false)
const editingUser = ref(null)
const userForm = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  type: 'particulier',
  blocked: false
})

const users = ref([
  {
    id: 1,
    firstname: 'Marie',
    lastname: 'Dubois',
    email: 'marie.dubois@email.com',
    type: 'particulier',
    blocked: false,
    itemsSold: 12,
    memberSince: '2024-01-15',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: 2,
    firstname: 'Jean',
    lastname: 'Martin',
    email: 'jean.martin@email.com',
    type: 'professionnel',
    blocked: false,
    itemsSold: 45,
    memberSince: '2023-06-20',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 3,
    firstname: 'Sophie',
    lastname: 'Bernard',
    email: 'sophie.bernard@email.com',
    type: 'particulier',
    blocked: true,
    itemsSold: 5,
    memberSince: '2024-03-10',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 4,
    firstname: 'Galerie',
    lastname: 'ArtModerne',
    email: 'contact@artmoderne.fr',
    type: 'professionnel',
    blocked: false,
    itemsSold: 128,
    memberSince: '2022-11-05',
    avatar: 'https://i.pravatar.cc/150?img=33'
  },
  {
    id: 5,
    firstname: 'Pierre',
    lastname: 'Leroy',
    email: 'pierre.leroy@email.com',
    type: 'particulier',
    blocked: false,
    itemsSold: 8,
    memberSince: '2024-08-22',
    avatar: 'https://i.pravatar.cc/150?img=15'
  }
])

const filteredUsers = computed(() => {
  if (userFilter.value === 'tous') return users.value
  if (userFilter.value === 'particuliers') return users.value.filter(u => u.type === 'particulier')
  if (userFilter.value === 'professionnels') return users.value.filter(u => u.type === 'professionnel')
  if (userFilter.value === 'bloques') return users.value.filter(u => u.blocked)
  return users.value
})

// Filtres
const userFilter = ref('tous')
const venteFilter = ref('toutes')
const avisFilter = ref('tous')

// Avis clients
const avis = ref([
  {
    id: 'AVIS-001',
    date: '2025-12-12',
    auteur: 'Sophie Bernard',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=5',
    destinataire: 'Pierre Leroy',
    typeDestinataire: 'particulier',
    transaction: 'Lampe Tiffany authentique',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Transaction parfaite !',
    commentaire: 'Vendeur très professionnel, objet conforme à la description. Emballage soigné et livraison rapide. Je recommande vivement !',
    reponse: null,
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-002',
    date: '2025-12-11',
    auteur: 'Pierre Leroy',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=15',
    destinataire: 'Sophie Bernard',
    typeDestinataire: 'particulier',
    transaction: 'Tableau huile sur toile',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Excellente acheteuse',
    commentaire: 'Paiement immédiat, communication fluide. Transaction idéale, merci !',
    reponse: {
      date: '2025-12-11',
      texte: 'Merci beaucoup pour cet avis ! Très heureuse de mon acquisition.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-003',
    date: '2025-12-10',
    auteur: 'Marie Dubois',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=1',
    destinataire: 'Galerie ArtModerne',
    typeDestinataire: 'professionnel',
    transaction: 'Fauteuil Louis XV estampillé',
    typeTransaction: 'vente',
    note: 4,
    titre: 'Très beau meuble',
    commentaire: 'Objet magnifique et authentique. Juste un petit délai de livraison plus long que prévu, mais la qualité est au rendez-vous.',
    reponse: {
      date: '2025-12-10',
      texte: 'Merci pour votre confiance. Nous nous excusons pour le délai, nous travaillons à améliorer nos services de livraison.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-004',
    date: '2025-12-10',
    auteur: 'Galerie ArtModerne',
    typeAuteur: 'professionnel',
    avatar: 'https://i.pravatar.cc/150?img=33',
    destinataire: 'Jean Martin',
    typeDestinataire: 'particulier',
    transaction: 'Montre Rolex Submariner 1960',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Pièce exceptionnelle',
    commentaire: 'Vendeur sérieux, authentification parfaite. La montre est en excellent état. Nous recommandons ce vendeur pour les pièces de collection.',
    reponse: null,
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-005',
    date: '2025-12-09',
    auteur: 'Jean Martin',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=12',
    destinataire: 'Marie Dubois',
    typeDestinataire: 'particulier',
    transaction: 'Objet non conforme',
    typeTransaction: 'retour',
    note: 2,
    titre: 'Déçu par la transaction',
    commentaire: 'L\'objet ne correspondait pas à la description. Heureusement le remboursement s\'est bien passé mais j\'ai perdu du temps.',
    reponse: {
      date: '2025-12-09',
      texte: 'Toutes mes excuses, je pensais que la description était complète. Le remboursement a été effectué immédiatement.'
    },
    statut: 'publie',
    signale: true,
    motifSignalement: 'Contestation description produit',
    verificationAchat: true
  },
  {
    id: 'AVIS-006',
    date: '2025-12-08',
    auteur: 'Sophie Bernard',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=5',
    destinataire: 'Galerie ArtModerne',
    typeDestinataire: 'professionnel',
    transaction: 'Sculpture bronze Art Déco',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Service impeccable',
    commentaire: 'Galerie très professionnelle, certificat d\'authenticité fourni, emballage museum quality. Un vrai plaisir de travailler avec eux.',
    reponse: {
      date: '2025-12-08',
      texte: 'Merci infiniment pour votre confiance. Au plaisir de vous accompagner dans vos futures acquisitions !'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-007',
    date: '2025-12-07',
    auteur: 'Galerie ArtModerne',
    typeAuteur: 'professionnel',
    avatar: 'https://i.pravatar.cc/150?img=33',
    destinataire: 'Jean Martin',
    typeDestinataire: 'particulier',
    transaction: 'Commode Louis XVI marqueterie',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Meuble d\'exception',
    commentaire: 'Magnifique pièce, estampille visible, état remarquable. Vendeur passionné et de confiance. Transaction parfaite.',
    reponse: {
      date: '2025-12-07',
      texte: 'Merci beaucoup ! Ravi que cette commode trouve une seconde vie dans votre galerie.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-008',
    date: '2025-12-06',
    auteur: 'Pierre Leroy',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=15',
    destinataire: 'Sophie Bernard',
    typeDestinataire: 'particulier',
    transaction: 'Vase Ming 18e siècle',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Pièce rare et authentique',
    commentaire: 'Expertise fournie, provenance documentée. Sophie est une vendeuse sérieuse et passionnée. Hautement recommandée.',
    reponse: null,
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-009',
    date: '2025-12-05',
    auteur: 'Marie Dubois',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=1',
    destinataire: 'Pierre Leroy',
    typeDestinataire: 'particulier',
    transaction: 'Collier perles de Tahiti',
    typeTransaction: 'vente',
    note: 4,
    titre: 'Belle pièce',
    commentaire: 'Collier conforme, belles perles. Emballage simple mais efficace. Bon rapport qualité-prix.',
    reponse: {
      date: '2025-12-05',
      texte: 'Merci pour votre achat ! Je vais améliorer mes emballages.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-010',
    date: '2025-12-04',
    auteur: 'Jean Martin',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=12',
    destinataire: 'Galerie ArtModerne',
    typeDestinataire: 'professionnel',
    transaction: 'Miroir vénitien 17e siècle',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Professionnalisme exemplaire',
    commentaire: 'Authentification détaillée, transport sécurisé avec assurance, suivi personnalisé. C\'est un plaisir de faire affaire avec cette galerie.',
    reponse: {
      date: '2025-12-04',
      texte: 'Merci pour votre confiance renouvelée. À très bientôt pour de nouvelles découvertes !'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-011',
    date: '2025-12-03',
    auteur: 'Sophie Bernard',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=5',
    destinataire: 'Pierre Leroy',
    typeDestinataire: 'particulier',
    transaction: 'Lustre cristal Baccarat',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Lustre magnifique',
    commentaire: 'Pièce sublime, tous les cristaux sont présents. Démontage et remontage expliqués. Vendeur à l\'écoute et disponible.',
    reponse: null,
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-012',
    date: '2025-12-02',
    auteur: 'Marie Dubois',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=1',
    destinataire: 'Jean Martin',
    typeDestinataire: 'particulier',
    transaction: 'Tapis persan ancien',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Tapis superbe',
    commentaire: 'Très beau tapis, couleurs vives, bon état général. Vendeur sympathique et de bon conseil. Transaction rapide.',
    reponse: {
      date: '2025-12-02',
      texte: 'Merci Marie ! Content qu\'il vous plaise.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-013',
    date: '2025-12-01',
    auteur: 'Galerie ArtModerne',
    typeAuteur: 'professionnel',
    avatar: 'https://i.pravatar.cc/150?img=33',
    destinataire: 'Sophie Bernard',
    typeDestinataire: 'particulier',
    transaction: 'Montre Patek Philippe 1950',
    typeTransaction: 'vente',
    note: 5,
    titre: 'Montre d\'exception',
    commentaire: 'Pièce rare en excellent état, boîte et papiers d\'origine. Sophie connaît parfaitement ses pièces. Vendeuse de grande qualité.',
    reponse: {
      date: '2025-12-01',
      texte: 'Merci beaucoup ! Cette montre appartenait à mon grand-père, je suis heureuse qu\'elle soit entre de bonnes mains.'
    },
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-014',
    date: '2025-11-30',
    auteur: 'Pierre Leroy',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=15',
    destinataire: 'Jean Martin',
    typeDestinataire: 'particulier',
    transaction: 'Bureau plat style Louis XV',
    typeTransaction: 'vente',
    note: 4,
    titre: 'Beau bureau',
    commentaire: 'Meuble de qualité, quelques petites restaurations à prévoir mais rien de grave. Prix correct. Bonne transaction.',
    reponse: null,
    statut: 'publie',
    signale: false,
    verificationAchat: true
  },
  {
    id: 'AVIS-015',
    date: '2025-11-29',
    auteur: 'Jean Martin',
    typeAuteur: 'particulier',
    avatar: 'https://i.pravatar.cc/150?img=12',
    destinataire: 'Marie Dubois',
    typeDestinataire: 'particulier',
    transaction: 'Service à café porcelaine',
    typeTransaction: 'vente',
    note: 3,
    titre: 'Correct',
    commentaire: 'Service complet mais quelques fêles non mentionnées. Prix revu à la baisse après discussion. Arrangement trouvé.',
    reponse: {
      date: '2025-11-29',
      texte: 'Désolée pour cet oubli, merci de votre compréhension.'
    },
    statut: 'en_attente',
    signale: false,
    verificationAchat: true
  }
])

const filteredAvis = computed(() => {
  if (avisFilter.value === 'tous') return avis.value
  if (avisFilter.value === 'particuliers') return avis.value.filter(a => a.typeAuteur === 'particulier')
  if (avisFilter.value === 'professionnels') return avis.value.filter(a => a.typeAuteur === 'professionnel')
  if (avisFilter.value === 'signales') return avis.value.filter(a => a.signale)
  if (avisFilter.value === 'en_attente') return avis.value.filter(a => a.statut === 'en_attente')
  return avis.value
})

const avisStats = computed(() => {
  const publies = avis.value.filter(a => a.statut === 'publie')
  const totalNotes = publies.reduce((sum, a) => sum + a.note, 0)
  const moyenneNotes = publies.length > 0 ? (totalNotes / publies.length).toFixed(1) : 0

  return {
    total: avis.value.length,
    particuliers: avis.value.filter(a => a.typeAuteur === 'particulier').length,
    professionnels: avis.value.filter(a => a.typeAuteur === 'professionnel').length,
    signales: avis.value.filter(a => a.signale).length,
    enAttente: avis.value.filter(a => a.statut === 'en_attente').length,
    moyenneNotes,
    note5: publies.filter(a => a.note === 5).length,
    note4: publies.filter(a => a.note === 4).length,
    note3: publies.filter(a => a.note === 3).length,
    note2: publies.filter(a => a.note === 2).length,
    note1: publies.filter(a => a.note === 1).length
  }
})

// Ventes - Enchères et Ventes rapides
const ventes = ref([
  {
    id: 1,
    titre: 'Vase en porcelaine de Sèvres',
    type: 'enchere',
    statut: 'en_cours',
    vendeur: 'Marie Dubois',
    prixActuel: 1850,
    prixDepart: 1200,
    nombreEncheres: 12,
    tempsRestant: '2j 14h',
    dateDebut: '2025-12-10',
    dateFin: '2025-12-14',
    categorie: 'Objets d\'art & tableaux',
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400'
  },
  {
    id: 2,
    titre: 'Montre Rolex Submariner 1960',
    type: 'enchere',
    statut: 'en_cours',
    vendeur: 'Jean Martin',
    prixActuel: 8500,
    prixDepart: 6000,
    nombreEncheres: 28,
    tempsRestant: '1j 8h',
    dateDebut: '2025-12-09',
    dateFin: '2025-12-13',
    categorie: 'Bijoux & montres',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400'
  },
  {
    id: 3,
    titre: 'Fauteuil Louis XV estampillé',
    type: 'vente_rapide',
    statut: 'en_cours',
    vendeur: 'Galerie ArtModerne',
    prix: 3200,
    datePublication: '2025-12-08',
    vues: 145,
    categorie: 'Meubles anciens',
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400'
  },
  {
    id: 4,
    titre: 'Tableau huile sur toile - Paysage impressionniste',
    type: 'enchere',
    statut: 'terminee',
    vendeur: 'Sophie Bernard',
    prixFinal: 4200,
    prixDepart: 2500,
    nombreEncheres: 35,
    dateDebut: '2025-12-01',
    dateFin: '2025-12-05',
    acheteur: 'Pierre Leroy',
    categorie: 'Objets d\'art & tableaux',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400'
  },
  {
    id: 5,
    titre: 'Service à thé en argent massif',
    type: 'vente_rapide',
    statut: 'en_cours',
    vendeur: 'Marie Dubois',
    prix: 1450,
    datePublication: '2025-12-11',
    vues: 89,
    categorie: 'Bijoux & montres',
    image: 'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=400'
  },
  {
    id: 6,
    titre: 'Sculpture bronze Art Déco signée',
    type: 'enchere',
    statut: 'en_cours',
    vendeur: 'Galerie ArtModerne',
    prixActuel: 2800,
    prixDepart: 1800,
    nombreEncheres: 18,
    tempsRestant: '4j 2h',
    dateDebut: '2025-12-08',
    dateFin: '2025-12-16',
    categorie: 'Objets d\'art & tableaux',
    image: 'https://images.unsplash.com/photo-1551696785-927d4ac2d35b?w=400'
  },
  {
    id: 7,
    titre: 'Commode Louis XVI marqueterie',
    type: 'enchere',
    statut: 'terminee',
    vendeur: 'Jean Martin',
    prixFinal: 6500,
    prixDepart: 4000,
    nombreEncheres: 42,
    dateDebut: '2025-11-28',
    dateFin: '2025-12-02',
    acheteur: 'Galerie ArtModerne',
    categorie: 'Meubles anciens',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
  },
  {
    id: 8,
    titre: 'Lampe Tiffany authentique',
    type: 'vente_rapide',
    statut: 'vendue',
    vendeur: 'Pierre Leroy',
    prix: 5200,
    datePublication: '2025-12-05',
    dateVente: '2025-12-07',
    acheteur: 'Sophie Bernard',
    vues: 234,
    categorie: 'Objets d\'art & tableaux',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'
  }
])

const filteredVentes = computed(() => {
  if (venteFilter.value === 'toutes') return ventes.value
  if (venteFilter.value === 'encheres-cours') return ventes.value.filter(v => v.type === 'enchere' && v.statut === 'en_cours')
  if (venteFilter.value === 'encheres-terminees') return ventes.value.filter(v => v.type === 'enchere' && v.statut === 'terminee')
  if (venteFilter.value === 'ventes-rapides') return ventes.value.filter(v => v.type === 'vente_rapide')
  return ventes.value
})

const ventesStats = computed(() => {
  return {
    toutes: ventes.value.length,
    encheresEnCours: ventes.value.filter(v => v.type === 'enchere' && v.statut === 'en_cours').length,
    encheresTerminees: ventes.value.filter(v => v.type === 'enchere' && v.statut === 'terminee').length,
    ventesRapides: ventes.value.filter(v => v.type === 'vente_rapide' && v.statut === 'en_cours').length
  }
})

// Finance - Comptabilité
const transactions = ref([
  {
    id: 'TRX-2025-001',
    date: '2025-12-12',
    type: 'vente',
    description: 'Vente - Lampe Tiffany authentique',
    vendeur: 'Pierre Leroy',
    acheteur: 'Sophie Bernard',
    montant: 5200,
    commission: 416,
    montantNet: 4784,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-002',
    date: '2025-12-12',
    type: 'vente',
    description: 'Vente - Service à thé en argent massif',
    vendeur: 'Marie Dubois',
    acheteur: 'Jean Martin',
    montant: 1450,
    commission: 116,
    montantNet: 1334,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-003',
    date: '2025-12-11',
    type: 'vente',
    description: 'Vente - Tableau huile sur toile',
    vendeur: 'Sophie Bernard',
    acheteur: 'Pierre Leroy',
    montant: 4200,
    commission: 420,
    montantNet: 3780,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-004',
    date: '2025-12-11',
    type: 'vente',
    description: 'Vente - Fauteuil Louis XV estampillé',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Marie Dubois',
    montant: 3200,
    commission: 256,
    montantNet: 2944,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-005',
    date: '2025-12-10',
    type: 'vente',
    description: 'Vente - Montre Rolex Submariner 1960',
    vendeur: 'Jean Martin',
    acheteur: 'Galerie ArtModerne',
    montant: 8500,
    commission: 680,
    montantNet: 7820,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-006',
    date: '2025-12-10',
    type: 'vente',
    description: 'Vente - Sculpture bronze Art Déco signée',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Sophie Bernard',
    montant: 2800,
    commission: 224,
    montantNet: 2576,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-007',
    date: '2025-12-09',
    type: 'remboursement',
    description: 'Remboursement - Objet endommagé',
    vendeur: 'Jean Martin',
    acheteur: 'Marie Dubois',
    montant: -850,
    commission: -68,
    montantNet: -782,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-008',
    date: '2025-12-08',
    type: 'vente',
    description: 'Vente - Commode Louis XVI marqueterie',
    vendeur: 'Jean Martin',
    acheteur: 'Galerie ArtModerne',
    montant: 6500,
    commission: 650,
    montantNet: 5850,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-009',
    date: '2025-12-08',
    type: 'vente',
    description: 'Vente - Vase Ming 18e siècle',
    vendeur: 'Sophie Bernard',
    acheteur: 'Pierre Leroy',
    montant: 12500,
    commission: 1000,
    montantNet: 11500,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-010',
    date: '2025-12-07',
    type: 'vente',
    description: 'Vente - Collier perles de Tahiti',
    vendeur: 'Marie Dubois',
    acheteur: 'Galerie ArtModerne',
    montant: 3800,
    commission: 304,
    montantNet: 3496,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-011',
    date: '2025-12-07',
    type: 'vente',
    description: 'Vente - Miroir vénitien 17e siècle',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Jean Martin',
    montant: 4900,
    commission: 392,
    montantNet: 4508,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-012',
    date: '2025-12-06',
    type: 'vente',
    description: 'Vente - Lustre cristal Baccarat',
    vendeur: 'Pierre Leroy',
    acheteur: 'Sophie Bernard',
    montant: 7200,
    commission: 576,
    montantNet: 6624,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-013',
    date: '2025-12-06',
    type: 'vente',
    description: 'Vente - Tapis persan ancien',
    vendeur: 'Jean Martin',
    acheteur: 'Marie Dubois',
    montant: 5600,
    commission: 448,
    montantNet: 5152,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-014',
    date: '2025-12-05',
    type: 'vente',
    description: 'Vente - Secrétaire marqueterie Louis XV',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Pierre Leroy',
    montant: 9800,
    commission: 784,
    montantNet: 9016,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-015',
    date: '2025-12-05',
    type: 'vente',
    description: 'Vente - Pendule bronze doré Empire',
    vendeur: 'Sophie Bernard',
    acheteur: 'Jean Martin',
    montant: 2400,
    commission: 192,
    montantNet: 2208,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-016',
    date: '2025-12-04',
    type: 'remboursement',
    description: 'Remboursement - Authenticité contestée',
    vendeur: 'Marie Dubois',
    acheteur: 'Galerie ArtModerne',
    montant: -3200,
    commission: -256,
    montantNet: -2944,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-017',
    date: '2025-12-04',
    type: 'vente',
    description: 'Vente - Statuette bronze Rodin',
    vendeur: 'Pierre Leroy',
    acheteur: 'Sophie Bernard',
    montant: 15600,
    commission: 1248,
    montantNet: 14352,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-018',
    date: '2025-12-03',
    type: 'vente',
    description: 'Vente - Console marbre et bronze',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Marie Dubois',
    montant: 6800,
    commission: 544,
    montantNet: 6256,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-019',
    date: '2025-12-03',
    type: 'vente',
    description: 'Vente - Bibliothèque acajou massif',
    vendeur: 'Jean Martin',
    acheteur: 'Pierre Leroy',
    montant: 8900,
    commission: 712,
    montantNet: 8188,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-020',
    date: '2025-12-02',
    type: 'vente',
    description: 'Vente - Montre Patek Philippe 1950',
    vendeur: 'Sophie Bernard',
    acheteur: 'Galerie ArtModerne',
    montant: 22000,
    commission: 1760,
    montantNet: 20240,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-021',
    date: '2025-12-02',
    type: 'vente',
    description: 'Vente - Paire de bergères Louis XVI',
    vendeur: 'Marie Dubois',
    acheteur: 'Jean Martin',
    montant: 4500,
    commission: 360,
    montantNet: 4140,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-022',
    date: '2025-12-01',
    type: 'vente',
    description: 'Vente - Argenterie vermeil 19e siècle',
    vendeur: 'Pierre Leroy',
    acheteur: 'Sophie Bernard',
    montant: 5400,
    commission: 432,
    montantNet: 4968,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-023',
    date: '2025-12-01',
    type: 'vente',
    description: 'Vente - Porcelaine Sèvres 18e siècle',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Marie Dubois',
    montant: 7800,
    commission: 624,
    montantNet: 7176,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-024',
    date: '2025-11-30',
    type: 'vente',
    description: 'Vente - Bureau plat style Louis XV',
    vendeur: 'Jean Martin',
    acheteur: 'Pierre Leroy',
    montant: 11200,
    commission: 896,
    montantNet: 10304,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-025',
    date: '2025-11-30',
    type: 'vente',
    description: 'Vente - Tableau école française 19e',
    vendeur: 'Sophie Bernard',
    acheteur: 'Galerie ArtModerne',
    montant: 8400,
    commission: 672,
    montantNet: 7728,
    statut: 'completed',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-026',
    date: '2025-12-12',
    type: 'vente',
    description: 'Vente en cours - Vase en porcelaine',
    vendeur: 'Marie Dubois',
    acheteur: 'En attente',
    montant: 1850,
    commission: 148,
    montantNet: 1702,
    statut: 'pending',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-027',
    date: '2025-12-12',
    type: 'vente',
    description: 'Vente en cours - Sculpture Art Déco',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'En attente',
    montant: 2800,
    commission: 224,
    montantNet: 2576,
    statut: 'pending',
    methodePaiement: 'stripe'
  },
  {
    id: 'TRX-2025-028',
    date: '2025-12-11',
    type: 'vente',
    description: 'Vente en cours - Montre Cartier Tank',
    vendeur: 'Pierre Leroy',
    acheteur: 'En attente',
    montant: 6200,
    commission: 496,
    montantNet: 5704,
    statut: 'pending',
    methodePaiement: 'stripe'
  }
])

const stripeConfig = ref({
  apiKey: 'sk_test_••••••••••••••••••••••••••',
  publicKey: 'pk_test_••••••••••••••••••••••••••',
  webhookSecret: 'whsec_••••••••••••••••••••••••••',
  mode: 'test',
  commissionsActivees: true,
  payoutsAutomatiques: false,
  delaiPayout: 7
})

const statsFinance = computed(() => {
  const completed = transactions.value.filter(t => t.statut === 'completed')
  const totalVentes = completed.reduce((sum, t) => sum + (t.type === 'vente' ? t.montant : 0), 0)
  const totalCommissions = completed.reduce((sum, t) => sum + (t.type === 'vente' ? t.commission : 0), 0)
  const totalRemboursements = completed.reduce((sum, t) => sum + (t.type === 'remboursement' ? Math.abs(t.montant) : 0), 0)

  return {
    totalVentes,
    totalCommissions,
    totalRemboursements,
    nombreTransactions: completed.length,
    montantMoyen: totalVentes / completed.filter(t => t.type === 'vente').length || 0
  }
})

const financeFilter = ref('toutes')

const filteredTransactions = computed(() => {
  if (financeFilter.value === 'toutes') return transactions.value
  if (financeFilter.value === 'ventes') return transactions.value.filter(t => t.type === 'vente')
  if (financeFilter.value === 'remboursements') return transactions.value.filter(t => t.type === 'remboursement')
  if (financeFilter.value === 'en-attente') return transactions.value.filter(t => t.statut === 'pending')
  return transactions.value
})

// Livraisons
const livraisons = ref([
  {
    id: 'LIV-2025-001',
    dateCreation: '2025-12-12',
    numeroSuivi: 'CP123456789FR',
    transporteur: 'chronopost',
    nomTransporteur: 'Chronopost',
    statut: 'en_transit',
    vendeur: 'Marie Dubois',
    acheteur: 'Sophie Bernard',
    article: 'Vase en porcelaine de Sèvres',
    adresse: '15 Rue de la Paix, 75002 Paris',
    poids: 2.5,
    prix: 12.50,
    dateEnlevement: '2025-12-12',
    dateLivraisonPrevue: '2025-12-13',
    etapes: [
      { date: '2025-12-12 09:30', lieu: 'Paris 16e', description: 'Colis pris en charge' },
      { date: '2025-12-12 14:20', lieu: 'Centre de tri Paris', description: 'En cours de tri' }
    ]
  },
  {
    id: 'LIV-2025-002',
    dateCreation: '2025-12-11',
    numeroSuivi: 'MR987654321FR',
    transporteur: 'mondial_relay',
    nomTransporteur: 'Mondial Relay',
    statut: 'livre',
    vendeur: 'Jean Martin',
    acheteur: 'Pierre Leroy',
    article: 'Montre Rolex Submariner 1960',
    adresse: 'Point Relais - 45 Avenue des Champs, 75008 Paris',
    poids: 0.5,
    prix: 5.90,
    dateEnlevement: '2025-12-11',
    dateLivraison: '2025-12-12',
    dateLivraisonPrevue: '2025-12-12',
    etapes: [
      { date: '2025-12-11 10:00', lieu: 'Paris 8e', description: 'Colis pris en charge' },
      { date: '2025-12-11 15:30', lieu: 'Agence Mondial Relay', description: 'En cours d\'acheminement' },
      { date: '2025-12-12 08:45', lieu: 'Point Relais Paris 8e', description: 'Disponible en point relais' },
      { date: '2025-12-12 16:20', lieu: 'Point Relais Paris 8e', description: 'Colis récupéré' }
    ]
  },
  {
    id: 'LIV-2025-003',
    dateCreation: '2025-12-11',
    numeroSuivi: 'CL456789123FR',
    transporteur: 'colissimo',
    nomTransporteur: 'Colissimo',
    statut: 'en_preparation',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Marie Dubois',
    article: 'Fauteuil Louis XV estampillé',
    adresse: '28 Boulevard Haussmann, 75009 Paris',
    poids: 18.0,
    prix: 25.00,
    dateEnlevement: '2025-12-13',
    dateLivraisonPrevue: '2025-12-15',
    etapes: [
      { date: '2025-12-11 11:00', lieu: 'Paris 9e', description: 'Étiquette créée' }
    ]
  },
  {
    id: 'LIV-2025-004',
    dateCreation: '2025-12-10',
    numeroSuivi: 'UPS789456123FR',
    transporteur: 'ups',
    nomTransporteur: 'UPS',
    statut: 'livre',
    vendeur: 'Sophie Bernard',
    acheteur: 'Galerie ArtModerne',
    article: 'Tableau huile sur toile - Paysage impressionniste',
    adresse: '12 Rue du Louvre, 75001 Paris',
    poids: 8.5,
    prix: 18.90,
    dateEnlevement: '2025-12-10',
    dateLivraison: '2025-12-11',
    dateLivraisonPrevue: '2025-12-11',
    etapes: [
      { date: '2025-12-10 09:00', lieu: 'Paris 1er', description: 'Colis récupéré' },
      { date: '2025-12-10 13:45', lieu: 'Hub UPS Paris', description: 'En transit' },
      { date: '2025-12-11 08:30', lieu: 'Paris 1er', description: 'En cours de livraison' },
      { date: '2025-12-11 10:15', lieu: 'Paris 1er', description: 'Livré' }
    ]
  },
  {
    id: 'LIV-2025-005',
    dateCreation: '2025-12-10',
    numeroSuivi: 'CP987123456FR',
    transporteur: 'chronopost',
    nomTransporteur: 'Chronopost',
    statut: 'en_transit',
    vendeur: 'Pierre Leroy',
    acheteur: 'Jean Martin',
    article: 'Service à thé en argent massif',
    adresse: '8 Place Vendôme, 75001 Paris',
    poids: 3.2,
    prix: 13.50,
    dateEnlevement: '2025-12-10',
    dateLivraisonPrevue: '2025-12-13',
    etapes: [
      { date: '2025-12-10 11:00', lieu: 'Paris 1er', description: 'Colis pris en charge' },
      { date: '2025-12-10 16:30', lieu: 'Centre de tri Paris', description: 'En cours de tri' },
      { date: '2025-12-11 08:00', lieu: 'Plateforme régionale', description: 'En transit' }
    ]
  },
  {
    id: 'LIV-2025-006',
    dateCreation: '2025-12-09',
    numeroSuivi: 'MR741852963FR',
    transporteur: 'mondial_relay',
    nomTransporteur: 'Mondial Relay',
    statut: 'livre',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Sophie Bernard',
    article: 'Sculpture bronze Art Déco signée',
    adresse: 'Point Relais - 33 Rue Rivoli, 75004 Paris',
    poids: 5.8,
    prix: 7.90,
    dateEnlevement: '2025-12-09',
    dateLivraison: '2025-12-10',
    dateLivraisonPrevue: '2025-12-10',
    etapes: [
      { date: '2025-12-09 09:30', lieu: 'Paris 4e', description: 'Colis pris en charge' },
      { date: '2025-12-09 14:00', lieu: 'Agence Mondial Relay', description: 'En transit' },
      { date: '2025-12-10 09:15', lieu: 'Point Relais Paris 4e', description: 'Disponible en point relais' },
      { date: '2025-12-10 14:30', lieu: 'Point Relais Paris 4e', description: 'Colis récupéré' }
    ]
  },
  {
    id: 'LIV-2025-007',
    dateCreation: '2025-12-09',
    numeroSuivi: 'CL159357486FR',
    transporteur: 'colissimo',
    nomTransporteur: 'Colissimo',
    statut: 'livre',
    vendeur: 'Jean Martin',
    acheteur: 'Pierre Leroy',
    article: 'Commode Louis XVI marqueterie',
    adresse: '42 Avenue Montaigne, 75008 Paris',
    poids: 45.0,
    prix: 35.00,
    dateEnlevement: '2025-12-09',
    dateLivraison: '2025-12-11',
    dateLivraisonPrevue: '2025-12-11',
    etapes: [
      { date: '2025-12-09 10:00', lieu: 'Paris 8e', description: 'Colis pris en charge' },
      { date: '2025-12-09 15:00', lieu: 'Centre de tri Colissimo', description: 'En cours de tri' },
      { date: '2025-12-10 08:30', lieu: 'Plateforme Paris', description: 'En transit' },
      { date: '2025-12-11 11:00', lieu: 'Paris 8e', description: 'Livré' }
    ]
  },
  {
    id: 'LIV-2025-008',
    dateCreation: '2025-12-08',
    numeroSuivi: 'UPS852741963FR',
    transporteur: 'ups',
    nomTransporteur: 'UPS',
    statut: 'incident',
    vendeur: 'Marie Dubois',
    acheteur: 'Galerie ArtModerne',
    article: 'Vase Ming 18e siècle',
    adresse: '18 Rue Saint-Honoré, 75001 Paris',
    poids: 4.5,
    prix: 16.50,
    dateEnlevement: '2025-12-08',
    dateLivraisonPrevue: '2025-12-09',
    incident: 'Adresse introuvable - Contact client nécessaire',
    etapes: [
      { date: '2025-12-08 09:30', lieu: 'Paris 1er', description: 'Colis récupéré' },
      { date: '2025-12-08 14:00', lieu: 'Hub UPS Paris', description: 'En transit' },
      { date: '2025-12-09 09:00', lieu: 'Paris 1er', description: 'Échec de livraison - Adresse incomplète' }
    ]
  },
  {
    id: 'LIV-2025-009',
    dateCreation: '2025-12-08',
    numeroSuivi: 'CP753951846FR',
    transporteur: 'chronopost',
    nomTransporteur: 'Chronopost',
    statut: 'livre',
    vendeur: 'Sophie Bernard',
    acheteur: 'Marie Dubois',
    article: 'Collier perles de Tahiti',
    adresse: '7 Rue de Castiglione, 75001 Paris',
    poids: 0.3,
    prix: 11.00,
    dateEnlevement: '2025-12-08',
    dateLivraison: '2025-12-09',
    dateLivraisonPrevue: '2025-12-09',
    etapes: [
      { date: '2025-12-08 10:00', lieu: 'Paris 1er', description: 'Colis pris en charge' },
      { date: '2025-12-08 15:30', lieu: 'Centre Chronopost', description: 'En cours de tri' },
      { date: '2025-12-09 08:45', lieu: 'Paris 1er', description: 'En cours de livraison' },
      { date: '2025-12-09 10:30', lieu: 'Paris 1er', description: 'Livré' }
    ]
  },
  {
    id: 'LIV-2025-010',
    dateCreation: '2025-12-07',
    numeroSuivi: 'MR369258147FR',
    transporteur: 'mondial_relay',
    nomTransporteur: 'Mondial Relay',
    statut: 'en_preparation',
    vendeur: 'Galerie ArtModerne',
    acheteur: 'Jean Martin',
    article: 'Miroir vénitien 17e siècle',
    adresse: 'Point Relais - 55 Rue de Rennes, 75006 Paris',
    poids: 12.0,
    prix: 9.90,
    dateEnlevement: '2025-12-13',
    dateLivraisonPrevue: '2025-12-15',
    etapes: [
      { date: '2025-12-07 14:00', lieu: 'Paris 6e', description: 'Étiquette créée' }
    ]
  }
])

const transporteurs = ref([
  {
    id: 'chronopost',
    nom: 'Chronopost',
    logo: '📦',
    actif: true,
    delaiMin: 1,
    delaiMax: 2,
    poidsMax: 30,
    tarifs: [
      { poidsMax: 1, prix: 9.90 },
      { poidsMax: 5, prix: 12.50 },
      { poidsMax: 10, prix: 16.90 },
      { poidsMax: 30, prix: 24.90 }
    ],
    suiviTempsReel: true,
    livraisonDomicile: true,
    pointRelais: false,
    assurance: true
  },
  {
    id: 'mondial_relay',
    nom: 'Mondial Relay',
    logo: '🏪',
    actif: true,
    delaiMin: 2,
    delaiMax: 4,
    poidsMax: 20,
    tarifs: [
      { poidsMax: 1, prix: 4.90 },
      { poidsMax: 5, prix: 5.90 },
      { poidsMax: 10, prix: 7.90 },
      { poidsMax: 20, prix: 9.90 }
    ],
    suiviTempsReel: true,
    livraisonDomicile: false,
    pointRelais: true,
    assurance: true
  },
  {
    id: 'colissimo',
    nom: 'Colissimo',
    logo: '📮',
    actif: true,
    delaiMin: 2,
    delaiMax: 3,
    poidsMax: 50,
    tarifs: [
      { poidsMax: 1, prix: 6.90 },
      { poidsMax: 5, prix: 11.50 },
      { poidsMax: 10, prix: 15.90 },
      { poidsMax: 30, prix: 25.00 },
      { poidsMax: 50, prix: 35.00 }
    ],
    suiviTempsReel: true,
    livraisonDomicile: true,
    pointRelais: true,
    assurance: true
  },
  {
    id: 'ups',
    nom: 'UPS',
    logo: '🚚',
    actif: true,
    delaiMin: 1,
    delaiMax: 3,
    poidsMax: 70,
    tarifs: [
      { poidsMax: 1, prix: 12.90 },
      { poidsMax: 5, prix: 16.90 },
      { poidsMax: 10, prix: 18.90 },
      { poidsMax: 30, prix: 28.00 },
      { poidsMax: 70, prix: 45.00 }
    ],
    suiviTempsReel: true,
    livraisonDomicile: true,
    pointRelais: false,
    assurance: true
  }
])

const livraisonFilter = ref('toutes')

const filteredLivraisons = computed(() => {
  if (livraisonFilter.value === 'toutes') return livraisons.value
  if (livraisonFilter.value === 'en_preparation') return livraisons.value.filter(l => l.statut === 'en_preparation')
  if (livraisonFilter.value === 'en_transit') return livraisons.value.filter(l => l.statut === 'en_transit')
  if (livraisonFilter.value === 'livre') return livraisons.value.filter(l => l.statut === 'livre')
  if (livraisonFilter.value === 'incident') return livraisons.value.filter(l => l.statut === 'incident')
  return livraisons.value
})

const livraisonsStats = computed(() => {
  return {
    toutes: livraisons.value.length,
    enPreparation: livraisons.value.filter(l => l.statut === 'en_preparation').length,
    enTransit: livraisons.value.filter(l => l.statut === 'en_transit').length,
    livrees: livraisons.value.filter(l => l.statut === 'livre').length,
    incidents: livraisons.value.filter(l => l.statut === 'incident').length
  }
})

// Commissions globales
const commissionsGlobales = ref({
  acheteur: 5.0,
  vendeur: 8.0
})

// Commissions par catégorie
const commissionsCategories = ref([
  {
    id: 1,
    nom: 'Bijoux & montres',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 2,
    nom: 'Meubles anciens',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 3,
    nom: 'Objets d\'art & tableaux',
    personnalise: true,
    commissionAcheteur: 6.5,
    commissionVendeur: 10.0,
    expanded: false
  },
  {
    id: 4,
    nom: 'Objets de collection',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 5,
    nom: 'Vins & spiritueux de collection',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 6,
    nom: 'Instruments de musique',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 7,
    nom: 'Livres anciens & manuscrits',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 8,
    nom: 'Mode & accessoires de luxe',
    personnalise: true,
    commissionAcheteur: 7.0,
    commissionVendeur: 12.0,
    expanded: false
  },
  {
    id: 9,
    nom: 'Horlogerie & pendules anciennes',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 10,
    nom: 'Photographies anciennes & appareils vintage',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 11,
    nom: 'Vaisselle & argenterie & cristallerie',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 12,
    nom: 'Sculptures & objets décoratifs',
    personnalise: false,
    commissionAcheteur: 5.0,
    commissionVendeur: 8.0,
    expanded: false
  },
  {
    id: 13,
    nom: 'Véhicules de collection',
    personnalise: true,
    commissionAcheteur: 3.0,
    commissionVendeur: 5.0,
    expanded: false
  }
])

// Simulateur
const simulateur = ref({
  montant: 1000,
  categorieId: null
})

// Calculs du simulateur
const simulateurData = computed(() => {
  const montant = simulateur.value.montant || 0
  let tauxAcheteur = commissionsGlobales.value.acheteur
  let tauxVendeur = commissionsGlobales.value.vendeur

  // Si une catégorie est sélectionnée et personnalisée
  if (simulateur.value.categorieId) {
    const categorie = commissionsCategories.value.find(c => c.id === simulateur.value.categorieId)
    if (categorie && categorie.personnalise) {
      tauxAcheteur = categorie.commissionAcheteur
      tauxVendeur = categorie.commissionVendeur
    }
  }

  const commissionAcheteur = (montant * tauxAcheteur / 100).toFixed(2)
  const commissionVendeur = (montant * tauxVendeur / 100).toFixed(2)
  const totalPlateforme = (parseFloat(commissionAcheteur) + parseFloat(commissionVendeur)).toFixed(2)
  const totalAcheteur = (montant + parseFloat(commissionAcheteur)).toFixed(2)
  const totalVendeur = (montant - parseFloat(commissionVendeur)).toFixed(2)
  const tauxTotal = (tauxAcheteur + tauxVendeur).toFixed(2)

  return {
    commissionAcheteur,
    commissionVendeur,
    totalPlateforme,
    totalAcheteur,
    totalVendeur,
    tauxAcheteur: tauxAcheteur.toFixed(2),
    tauxVendeur: tauxVendeur.toFixed(2),
    tauxTotal
  }
})

// Assigner les valeurs calculées au simulateur
watch(simulateurData, (newVal) => {
  Object.assign(simulateur.value, newVal)
}, { immediate: true })

// Taux actuels en fonction du mode
const tauxActuels = computed({
  get: () => {
    if (modeModification.value === 'global') {
      return commissionsGlobales.value
    } else if (categorieSelectionnee.value) {
      const categorie = commissionsCategories.value.find(c => c.id === categorieSelectionnee.value)
      return categorie ? {
        acheteur: categorie.commissionAcheteur,
        vendeur: categorie.commissionVendeur
      } : commissionsGlobales.value
    }
    return { acheteur: 0, vendeur: 0 }
  },
  set: (newValue) => {
    if (modeModification.value === 'global') {
      commissionsGlobales.value = newValue
    } else if (categorieSelectionnee.value) {
      const categorie = commissionsCategories.value.find(c => c.id === categorieSelectionnee.value)
      if (categorie) {
        categorie.commissionAcheteur = newValue.acheteur
        categorie.commissionVendeur = newValue.vendeur
        categorie.personnalise = true
      }
    }
  }
})

// Fonctions
// Gestion des catégories
const openCategoryModal = (category = null) => {
  if (category) {
    editingCategory.value = category
    categoryForm.value = {
      name: category.name,
      description: category.description,
      iconName: category.iconName
    }
  } else {
    editingCategory.value = null
    categoryForm.value = {
      name: '',
      description: '',
      iconName: 'Gem'
    }
  }
  showCategoryModal.value = true
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: '',
    iconName: 'Gem'
  }
}

const saveCategory = () => {
  if (!categoryForm.value.name.trim()) {
    showNotification('Le nom de la catégorie est requis', 'error')
    return
  }

  if (editingCategory.value) {
    // Modification
    const index = categories.value.findIndex(c => c.id === editingCategory.value.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index],
        name: categoryForm.value.name,
        description: categoryForm.value.description,
        iconName: categoryForm.value.iconName,
        icon: iconComponents[categoryForm.value.iconName]
      }
      showNotification('Catégorie modifiée avec succès', 'success')
    }
  } else {
    // Ajout
    const newCategory = {
      id: categories.value.length + 1,
      name: categoryForm.value.name,
      description: categoryForm.value.description,
      iconName: categoryForm.value.iconName,
      icon: iconComponents[categoryForm.value.iconName],
      itemCount: 0
    }
    categories.value.push(newCategory)
    showNotification('Catégorie ajoutée avec succès', 'success')
  }

  closeCategoryModal()
}

// Gestion des utilisateurs
const openUserModal = (user = null) => {
  if (user) {
    editingUser.value = user
    userForm.value = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      password: '',
      type: user.type,
      blocked: user.blocked
    }
  } else {
    editingUser.value = null
    userForm.value = {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      type: 'particulier',
      blocked: false
    }
  }
  showUserModal.value = true
}

const closeUserModal = () => {
  showUserModal.value = false
  editingUser.value = null
  userForm.value = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    type: 'particulier',
    blocked: false
  }
}

const saveUser = () => {
  if (!userForm.value.firstname.trim() || !userForm.value.lastname.trim() || !userForm.value.email.trim()) {
    showNotification('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }

  if (!editingUser.value && !userForm.value.password) {
    showNotification('Le mot de passe est requis pour créer un utilisateur', 'error')
    return
  }

  if (editingUser.value) {
    // Modification
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        firstname: userForm.value.firstname,
        lastname: userForm.value.lastname,
        email: userForm.value.email,
        type: userForm.value.type,
        blocked: userForm.value.blocked
      }
      showNotification('Utilisateur modifié avec succès', 'success')
    }
  } else {
    // Ajout
    const newUser = {
      id: users.value.length + 1,
      firstname: userForm.value.firstname,
      lastname: userForm.value.lastname,
      email: userForm.value.email,
      type: userForm.value.type,
      blocked: userForm.value.blocked,
      itemsSold: 0,
      memberSince: new Date().toISOString().split('T')[0]
    }
    users.value.push(newUser)
    showNotification('Utilisateur créé avec succès', 'success')
  }

  closeUserModal()
}

const toggleUserBlock = (userId) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    user.blocked = !user.blocked
    showNotification(
      user.blocked ? 'Utilisateur bloqué' : 'Utilisateur débloqué',
      'success'
    )
  }
}

const deleteUser = (userId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    const index = users.value.findIndex(u => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
      showNotification('Utilisateur supprimé avec succès', 'success')
    }
  }
}

const deleteCategory = (categoryId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    const index = categories.value.findIndex(c => c.id === categoryId)
    if (index !== -1) {
      categories.value.splice(index, 1)
      showNotification('Catégorie supprimée avec succès', 'success')
    }
  }
}

const showNotification = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const calculerMontant = (montant, taux) => {
  return (montant * taux / 100).toFixed(2)
}

const calculerMontantVendeur = (montant, taux) => {
  return (montant - (montant * taux / 100)).toFixed(2)
}

const getCategorieNom = () => {
  if (!categorieSelectionnee.value) return ''
  const categorie = commissionsCategories.value.find(c => c.id === categorieSelectionnee.value)
  return categorie ? categorie.nom : ''
}

const appliquerModification = () => {
  if (modeModification.value === 'global') {
    // Appliquer aux catégories non personnalisées
    commissionsCategories.value.forEach(cat => {
      if (!cat.personnalise) {
        cat.commissionAcheteur = commissionsGlobales.value.acheteur
        cat.commissionVendeur = commissionsGlobales.value.vendeur
      }
    })
  }
}

const selectionnerCategorie = (id) => {
  modeModification.value = 'categorie'
  categorieSelectionnee.value = id
  // Scroll vers le haut pour voir la carte de modification
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleCategorie = (id) => {
  const categorie = commissionsCategories.value.find(c => c.id === id)
  if (categorie) {
    categorie.expanded = !categorie.expanded
  }
}

// Configuration du formulaire
const modeFormulaireConfig = ref('global')
const categorieFormulaireSelectionnee = ref(null)

// Catégories disponibles pour les formulaires
const categoriesDisponibles = ref([
  { id: 1, nom: 'Bijoux & montres' },
  { id: 2, nom: 'Meubles anciens' },
  { id: 3, nom: 'Objets d\'art & tableaux' },
  { id: 4, nom: 'Objets de collection' },
  { id: 5, nom: 'Vins & spiritueux de collection' },
  { id: 6, nom: 'Instruments de musique' },
  { id: 7, nom: 'Livres anciens & manuscrits' },
  { id: 8, nom: 'Mode vintage & accessoires' },
  { id: 9, nom: 'Jouets & jeux anciens' },
  { id: 10, nom: 'Céramiques & porcelaines' },
  { id: 11, nom: 'Arts de la table & argenterie' },
  { id: 12, nom: 'Curiosités & objets scientifiques' },
  { id: 13, nom: 'Autres objets de valeur' }
])

// Configuration globale du formulaire
const formulaireConfigGlobal = ref({
  nom: {
    actif: true,
    obligatoire: true,
    label: 'Nom de l\'objet',
    placeholder: 'Ex: Vase Art Déco en cristal',
    aide: 'Donnez un nom clair et précis à votre objet'
  },
  description: {
    actif: true,
    obligatoire: true,
    label: 'Description',
    placeholder: 'Décrivez votre objet en détail...',
    minLength: 50,
    maxLength: 2000
  },
  categorie: {
    actif: true,
    obligatoire: true,
    label: 'Catégorie'
  },
  photos: {
    actif: true,
    obligatoire: true,
    min: 1,
    max: 8,
    maxSize: 5
  },
  typeVente: {
    actif: true,
    obligatoire: true,
    options: {
      enchere: true,
      venteRapide: true
    }
  },
  prix: {
    actif: true,
    obligatoire: true,
    min: 1,
    max: 1000000
  },
  dateExpiration: {
    actif: true,
    obligatoire: false,
    minDays: 1,
    maxDays: 90
  },
  etat: {
    actif: true,
    obligatoire: false,
    options: 'Neuf, Excellent, Bon, Acceptable'
  }
})

// Configurations par catégorie
const formulairesParCategorie = ref({})

// Configuration active (computed)
const formulaireConfig = computed({
  get: () => {
    if (modeFormulaireConfig.value === 'global') {
      return formulaireConfigGlobal.value
    } else if (categorieFormulaireSelectionnee.value) {
      // Créer la config de catégorie si elle n'existe pas
      if (!formulairesParCategorie.value[categorieFormulaireSelectionnee.value]) {
        formulairesParCategorie.value[categorieFormulaireSelectionnee.value] = JSON.parse(JSON.stringify(formulaireConfigGlobal.value))
      }
      return formulairesParCategorie.value[categorieFormulaireSelectionnee.value]
    }
    return formulaireConfigGlobal.value
  },
  set: (newValue) => {
    if (modeFormulaireConfig.value === 'global') {
      formulaireConfigGlobal.value = newValue
    } else if (categorieFormulaireSelectionnee.value) {
      formulairesParCategorie.value[categorieFormulaireSelectionnee.value] = newValue
    }
  }
})

const getCategorieFormulaireNom = () => {
  if (!categorieFormulaireSelectionnee.value) return ''
  const categorie = categoriesDisponibles.value.find(c => c.id === categorieFormulaireSelectionnee.value)
  return categorie ? categorie.nom : ''
}

// Champs personnalisés globaux
const champsPersonnalisesGlobal = ref([])

// Champs personnalisés par catégorie
const champsPersonnalisesParCategorie = ref({})

// Champs personnalisés actifs (computed)
const champsPersonnalises = computed({
  get: () => {
    if (modeFormulaireConfig.value === 'global') {
      return champsPersonnalisesGlobal.value
    } else if (categorieFormulaireSelectionnee.value) {
      if (!champsPersonnalisesParCategorie.value[categorieFormulaireSelectionnee.value]) {
        champsPersonnalisesParCategorie.value[categorieFormulaireSelectionnee.value] = []
      }
      return champsPersonnalisesParCategorie.value[categorieFormulaireSelectionnee.value]
    }
    return []
  },
  set: (newValue) => {
    if (modeFormulaireConfig.value === 'global') {
      champsPersonnalisesGlobal.value = newValue
    } else if (categorieFormulaireSelectionnee.value) {
      champsPersonnalisesParCategorie.value[categorieFormulaireSelectionnee.value] = newValue
    }
  }
})

const formulaireConfig_OLD = ref({
  nom: {
    actif: true,
    obligatoire: true,
    label: 'Nom de l\'objet',
    placeholder: 'Ex: Vase Art Déco en cristal',
    aide: 'Donnez un nom clair et précis à votre objet'
  },
  description: {
    actif: true,
    obligatoire: true,
    label: 'Description',
    placeholder: 'Décrivez votre objet en détail...',
    minLength: 50,
    maxLength: 2000
  },
  categorie: {
    actif: true,
    obligatoire: true,
    label: 'Catégorie'
  },
  photos: {
    actif: true,
    obligatoire: true,
    min: 1,
    max: 8,
    maxSize: 5
  },
  typeVente: {
    actif: true,
    obligatoire: true,
    options: {
      enchere: true,
      venteRapide: true
    }
  },
  prix: {
    actif: true,
    obligatoire: true,
    min: 1,
    max: 1000000
  },
  dateExpiration: {
    actif: true,
    obligatoire: false,
    minDays: 1,
    maxDays: 90
  },
  etat: {
    actif: true,
    obligatoire: false,
    options: 'Neuf, Excellent, Bon, Acceptable'
  }
})

const expandedFields = ref({
  nom: false,
  description: false,
  categorie: false,
  photos: false,
  typeVente: false,
  prix: false,
  dateExpiration: false,
  etat: false
})

const showAddFieldModal = ref(false)
const nouveauChamp = ref({
  type: 'text',
  label: '',
  placeholder: '',
  aide: '',
  obligatoire: false,
  actif: true,
  options: ''
})

const toggleFieldExpand = (fieldName) => {
  expandedFields.value[fieldName] = !expandedFields.value[fieldName]
}

const openAddFieldModal = () => {
  showAddFieldModal.value = true
}

const closeAddFieldModal = () => {
  showAddFieldModal.value = false
  // Réinitialiser le formulaire
  nouveauChamp.value = {
    type: 'text',
    label: '',
    placeholder: '',
    aide: '',
    obligatoire: false,
    actif: true,
    options: ''
  }
}

const ajouterChamp = () => {
  if (!nouveauChamp.value.label) return

  const newId = 'custom_' + Date.now()
  const champ = {
    id: newId,
    ...nouveauChamp.value
  }

  // Ajouter à la liste active (global ou catégorie)
  const currentList = champsPersonnalises.value
  currentList.push(champ)

  // Mettre à jour via le computed setter
  champsPersonnalises.value = currentList

  expandedFields.value[newId] = false

  const contexte = modeFormulaireConfig.value === 'global'
    ? 'au formulaire global'
    : `à la catégorie "${getCategorieFormulaireNom()}"`

  toastMessage.value = `Champ "${champ.label}" ajouté avec succès ${contexte} !`
  toastType.value = 'success'
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)

  closeAddFieldModal()
}

const supprimerChamp = (fieldId) => {
  const champ = champsPersonnalises.value.find(c => c.id === fieldId)
  if (!champ) return

  if (confirm(`Êtes-vous sûr de vouloir supprimer le champ "${champ.label}" ?`)) {
    const currentList = champsPersonnalises.value.filter(c => c.id !== fieldId)
    champsPersonnalises.value = currentList
    delete expandedFields.value[fieldId]

    toastMessage.value = `Champ "${champ.label}" supprimé`
    toastType.value = 'success'
    showToast.value = true

    setTimeout(() => {
      showToast.value = false
    }, 3000)
  }
}

const getFieldIcon = (type) => {
  const icons = {
    text: Type,
    textarea: AlignLeft,
    number: Hash,
    select: FolderTree,
    date: Calendar,
    checkbox: CheckCircle,
    radio: ToggleLeft
  }
  return icons[type] || Type
}

const getFieldTypeName = (type) => {
  const names = {
    text: 'Texte court',
    textarea: 'Texte long',
    number: 'Nombre',
    select: 'Sélection',
    date: 'Date',
    checkbox: 'Case à cocher',
    radio: 'Choix multiple'
  }
  return names[type] || 'Texte'
}

const sauvegarderFormulaire = () => {
  // TODO: Appel API pour sauvegarder la configuration
  const contexte = modeFormulaireConfig.value === 'global'
    ? 'Formulaire global'
    : `Formulaire de la catégorie "${getCategorieFormulaireNom()}"`

  toastMessage.value = `${contexte} sauvegardé avec succès !`
  toastType.value = 'success'
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const sauvegarderCommissions = () => {
  // TODO: Appel API pour sauvegarder
  toastMessage.value = 'Commissions sauvegardées avec succès !'
  toastType.value = 'success'
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.backoffice-dashboard {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* En-tête */
.dashboard-header {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
}

.title-icon {
  color: #1f2937;
  -webkit-text-fill-color: initial;
}

.subtitle {
  font-size: 1.125rem;
  color: #6b7280;
  margin: 0;
}

/* Navigation tabs */
.tabs-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.tab-btn.active {
  background: #1f2937;
  border-color: #1f2937;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Contenu */
.tab-content {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
}

/* Section header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

/* Mode selector */
.mode-selector {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.mode-selector-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  font-size: 1.125rem;
}

.mode-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.mode-option {
  position: relative;
  cursor: pointer;
}

.mode-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.mode-option:hover .option-content {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.mode-option.active .option-content {
  background: #1f2937;
  border-color: #1f2937;
  color: white;
}

.option-content svg {
  flex-shrink: 0;
  color: #6b7280;
}

.mode-option.active .option-content svg {
  color: white;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.option-text strong {
  font-size: 1rem;
  color: #1f2937;
}

.mode-option.active .option-text strong {
  color: white;
}

.option-text span {
  font-size: 0.875rem;
  color: #6b7280;
}

.mode-option.active .option-text span {
  color: rgba(255, 255, 255, 0.8);
}

.category-selector {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.category-selector label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.75rem;
}

.category-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-select:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.apply-global-warning {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.95);
}

/* Section header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #1f2937;
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-save:hover {
  background: #111827;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Cards */
.commissions-card {
  background: #f9fafb;
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #e5e7eb;
}

.card-header {
  margin-bottom: 1.5rem;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.card-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Commissions globales */
.global-card {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  border: none;
}

.global-card .card-header h3,
.global-card .card-subtitle,
.global-card label {
  color: white;
}

.commissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.commission-item {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.commission-item label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.input-group {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.commission-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: none;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.commission-input:focus {
  outline: none;
}

.input-suffix {
  padding: 0 1rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  background: #f3f4f6;
}

.input-help {
  margin: 0.75rem 0 0 0;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
}

.commission-total {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1rem;
  color: white;
  font-size: 1rem;
}

/* Catégories */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.categorie-item {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  cursor: pointer;
}

.categorie-item:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.categorie-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  background: white;
}

.categorie-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.categorie-icon {
  color: #1f2937;
}

.categorie-nom {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.categorie-badges {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge-personnalise {
  padding: 0.25rem 0.75rem;
  background: #1f2937;
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.categorie-commissions-preview {
  display: flex;
  gap: 0.5rem;
}

.commission-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
}

.commission-badge.acheteur {
  background: #f3f4f6;
  color: #374151;
}

.commission-badge.vendeur {
  background: #f3f4f6;
  color: #374151;
}

.chevron-right {
  color: #9ca3af;
  transition: transform 0.3s;
}

.categorie-item:hover .chevron-right {
  transform: translateX(4px);
  color: #1f2937;
}

/* Ancienne liste catégories (cachée) */
.categories-list-old {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.categorie-nom {
  font-weight: 600;
  color: #1f2937;
}

.btn-toggle {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.3s;
}

.btn-toggle svg.rotated {
  transform: rotate(180deg);
}

.categorie-content {
  padding: 1.25rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* Switch toggle */
.categorie-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #1f2937;
}

input:checked+.slider:before {
  transform: translateX(24px);
}

.toggle-label {
  font-weight: 600;
  color: #1f2937;
}

/* Commissions catégorie */
.categorie-commissions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.commission-input-wrapper label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.categorie-default {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #e0e7ff;
  border-radius: 8px;
  color: #4338ca;
  font-size: 0.875rem;
}

/* Simulateur */
.simulator {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.simulator-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.input-wrapper label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.simulator-input,
.simulator-select {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
}

.simulator-input:focus,
.simulator-select:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.simulator-results {
  display: grid;
  gap: 1rem;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-radius: 10px;
  background: white;
  border: 2px solid #e5e7eb;
}

.result-item.acheteur {
  border-color: #94a3b8;
  background: #f8fafc;
}

.result-item.vendeur {
  border-color: #94a3b8;
  background: #f8fafc;
}

.result-item.total {
  border-color: #1f2937;
  background: #f9fafb;
}

.result-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.result-percentage {
  font-size: 0.875rem;
  color: #6b7280;
}

.result-summary {
  margin-top: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 12px;
  color: white;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 1.125rem;
}

.summary-row:not(:last-child) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Statistiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s;
}

.stat-card:hover {
  border-color: #d1d5db;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 12px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

/* Graphique de revenus */
.revenue-chart-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 2rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.chart-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.chart-subtitle {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.revenue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.legend-color.commissions {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.chart-container {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-y-axis {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 0.5rem 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  min-width: 60px;
  text-align: right;
}

.chart-content {
  flex: 1;
  position: relative;
}

.chart-bars {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  height: 400px;
  align-items: flex-end;
  padding: 1rem;
  background: linear-gradient(to top,
      #f9fafb 0%,
      #f9fafb 20%,
      transparent 20%,
      transparent 40%,
      #f9fafb 40%,
      #f9fafb 60%,
      transparent 60%,
      transparent 80%,
      #f9fafb 80%,
      #f9fafb 100%);
  border-radius: 12px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 0.3rem;
}

.bar {
  flex: 1;
  max-width: 32px;
  min-height: 40px;
  border-radius: 10px 10px 0 0;
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.75rem;
}

.bar:hover {
  opacity: 0.85;
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.revenue-bar {
  background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 3px 12px rgba(59, 130, 246, 0.5);
}

.commission-bar {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.5);
}

.bar-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.bar-value-small {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-align: center;
}

.chart-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.chart-stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.chart-stat-item svg {
  color: #3b82f6;
}

.chart-stat-label {
  display: block;
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.chart-stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.chart-stat-value.positive {
  color: #10b981;
}

/* Categories Section */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.category-item:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.category-icon {
  width: 48px;
  height: 48px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 10px;
  color: #1f2937;
}

.category-details h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.category-details p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.category-count {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon.edit {
  background: #dbeafe;
  color: #1e40af;
}

.btn-icon.edit:hover {
  background: #1e40af;
  color: white;
}

.btn-icon.delete {
  background: #fee2e2;
  color: #dc2626;
}

.btn-icon.delete:hover {
  background: #dc2626;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-close:hover {
  background: #e5e7eb;
}

.modal-body {
  padding: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #1f2937;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 2px solid #e5e7eb;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: #1f2937;
  color: white;
}

.btn-primary:hover {
  background: #111827;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Users Section */
.users-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.user-item:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 50%;
  color: #1f2937;
  overflow: hidden;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  flex: 1;
}

.user-info h3 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.user-info p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
}

.user-badges {
  display: flex;
  gap: 0.5rem;
}

.badge-type,
.badge-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-type.particulier {
  background: #dbeafe;
  color: #1e40af;
}

.badge-type.professionnel {
  background: #dcfce7;
  color: #15803d;
}

.badge-status.active {
  background: #d1fae5;
  color: #047857;
}

.badge-status.blocked {
  background: #fee2e2;
  color: #dc2626;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 700;
}

/* User Actions */
.user-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-action-edit {
  background: #eff6ff;
  color: #1e40af;
  border: 2px solid transparent;
}

.btn-action-edit:hover {
  background: #1e40af;
  color: white;
  border-color: #1e40af;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.3);
}

.btn-action-block.block {
  background: #fef3c7;
  color: #92400e;
  border: 2px solid transparent;
}

.btn-action-block.block:hover {
  background: #92400e;
  color: white;
  border-color: #92400e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(146, 64, 14, 0.3);
}

.btn-action-block.unblock {
  background: #d1fae5;
  color: #047857;
  border: 2px solid transparent;
}

.btn-action-block.unblock:hover {
  background: #047857;
  color: white;
  border-color: #047857;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(4, 120, 87, 0.3);
}

.btn-action-delete {
  background: #fee2e2;
  color: #dc2626;
  border: 2px solid transparent;
}

.btn-action-delete:hover {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

/* Ventes Section */
.ventes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.vente-item {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.vente-item:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.vente-image {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.vente-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vente-badge {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.vente-badge.enchere {
  color: #7c3aed;
}

.vente-badge.vente_rapide {
  color: #ea580c;
}

.vente-status {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
}

.vente-status.en-cours {
  color: #059669;
}

.vente-status.terminee {
  color: #6b7280;
}

.vente-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vente-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.vente-categorie {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #f3f4f6;
  color: #6b7280;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.vente-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.detail-row {
  display: flex;
  gap: 0.5rem;
  align-items: baseline;
}

.detail-row .label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.detail-row .value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 500;
}

.detail-row .value.price {
  font-size: 1.125rem;
  font-weight: 700;
  color: #059669;
}

.detail-row .value.highlight {
  color: #ea580c;
  font-weight: 700;
}

.vente-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  justify-content: center;
}

.btn-action-view {
  background: #f0f9ff;
  color: #0369a1;
  border: 2px solid transparent;
}

.btn-action-view:hover {
  background: #0369a1;
  color: white;
  border-color: #0369a1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(3, 105, 161, 0.3);
}

/* Placeholder */
.placeholder-text {
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
  padding: 3rem;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  font-weight: 600;
  z-index: 1000;
}

.toast.success {
  border-left: 4px solid #10b981;
  color: #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
  color: #ef4444;
}

/* Finance Section */
.finance-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.finance-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.finance-stat-card:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon-finance {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 12px;
}

.stat-icon-finance.commissions {
  background: #dcfce7;
  color: #15803d;
}

.stat-icon-finance.transactions {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon-finance.moyenne {
  background: #f3e8ff;
  color: #7c3aed;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label-finance {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.stat-value-finance {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.finance-tabs-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.finance-tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s;
  margin-bottom: -2px;
}

.finance-tab-btn:hover {
  color: #1f2937;
}

.finance-tab-btn.active {
  color: #1f2937;
  border-bottom-color: #1f2937;
}

/* Comptabilité */
.comptabilite-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.comptabilite-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.comptabilite-actions {
  display: flex;
  gap: 1rem;
}

.transactions-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.transactions-table {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.transactions-table table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table thead {
  background: #f9fafb;
}

.transactions-table th {
  padding: 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 2px solid #e5e7eb;
}

.transactions-table td {
  padding: 1rem;
  font-size: 0.875rem;
  color: #1f2937;
  border-bottom: 1px solid #f3f4f6;
}

.transactions-table tbody tr:hover {
  background: #f9fafb;
}

.transaction-id {
  font-family: monospace;
  font-weight: 600;
  color: #6b7280;
}

.type-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.type-badge.vente {
  background: #d1fae5;
  color: #047857;
}

.type-badge.remboursement {
  background: #fee2e2;
  color: #dc2626;
}

.description {
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.amount-positive {
  color: #059669;
  font-weight: 700;
}

.amount-negative {
  color: #dc2626;
  font-weight: 700;
}

.net-amount {
  font-weight: 700;
  color: #1f2937;
}

.statut-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.statut-badge.completed {
  background: #d1fae5;
  color: #047857;
}

.statut-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.payment-method {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #6b7280;
}

/* Stripe Configuration */
.stripe-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.stripe-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.stripe-mode-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 700;
}

.stripe-mode-badge.test {
  background: #fef3c7;
  color: #92400e;
}

.stripe-mode-badge.production {
  background: #d1fae5;
  color: #047857;
}

.stripe-config-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.config-section {
  padding: 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
}

.config-section h4 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.config-group {
  margin-bottom: 1.25rem;
}

.config-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.config-input-stripe {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.config-input-stripe:focus {
  outline: none;
  border-color: #1f2937;
}

.input-with-icon {
  display: flex;
  gap: 0.5rem;
}

.input-with-icon input {
  flex: 1;
}

.btn-copy {
  padding: 0.75rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-copy:hover {
  background: #e5e7eb;
}

.checkbox-label-stripe {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label-stripe input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.stripe-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stripe-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
}

.stripe-stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.stripe-stat-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 700;
}

.stripe-stat-value.error {
  color: #dc2626;
}

.stripe-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-stripe-action {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s;
}

.btn-stripe-action:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}

.btn-stripe-action.save {
  background: #1f2937;
  color: white;
  border-color: #1f2937;
}

.btn-stripe-action.save:hover {
  background: #111827;
}

/* Livraisons Section */
.livraison-stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.livraison-stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.3s;
}

.livraison-stat-card:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon-livraison {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #dbeafe;
  color: #1e40af;
  border-radius: 10px;
}

.stat-icon-livraison.preparation {
  background: #fef3c7;
  color: #92400e;
}

.stat-icon-livraison.transit {
  background: #e0e7ff;
  color: #4338ca;
}

.stat-icon-livraison.livree {
  background: #dcfce7;
  color: #15803d;
}

.stat-icon-livraison.incident {
  background: #fee2e2;
  color: #dc2626;
}

.livraison-tabs-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
}

.livraison-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.livraisons-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.livraison-item {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.livraison-item:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.livraison-header-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.livraison-main-info {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.livraison-id-status {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.livraison-id {
  font-family: monospace;
  font-weight: 700;
  font-size: 1rem;
  color: #1f2937;
}

.livraison-statut {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  width: fit-content;
}

.livraison-statut.en_preparation {
  background: #fef3c7;
  color: #92400e;
}

.livraison-statut.en_transit {
  background: #e0e7ff;
  color: #4338ca;
}

.livraison-statut.livre {
  background: #dcfce7;
  color: #15803d;
}

.livraison-statut.incident {
  background: #fee2e2;
  color: #dc2626;
}

.transporteur-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
  color: #1f2937;
}

.transporteur-logo {
  font-size: 1.25rem;
}

.livraison-tracking {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.tracking-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.tracking-number {
  font-family: monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
}

.livraison-details-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 1.5rem;
}

.livraison-col h4 {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  margin: 0 0 0.75rem 0;
}

.livraison-col p {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-weight: 500;
}

.article-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem !important;
}

.detail-row-small {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label-small {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
}

.value-small {
  font-size: 0.75rem;
  color: #1f2937;
  font-weight: 600;
}

.value-small.highlight {
  color: #059669;
  font-weight: 700;
}

.adresse-small {
  font-size: 0.75rem;
  color: #6b7280;
  line-height: 1.4;
}

.tracking-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tracking-step {
  display: flex;
  gap: 0.75rem;
  position: relative;
}

.tracking-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 24px;
  bottom: -16px;
  width: 2px;
  background: #e5e7eb;
}

.step-marker {
  width: 12px;
  height: 12px;
  background: #1f2937;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
  z-index: 1;
}

.step-content {
  flex: 1;
}

.step-date {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.step-lieu {
  font-size: 0.75rem;
  color: #1f2937;
  font-weight: 700;
  margin-bottom: 0.125rem;
}

.step-description {
  font-size: 0.75rem;
  color: #6b7280;
}

.incident-alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #fef2f2;
  border: 2px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Transporteurs */
.transporteurs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.transporteur-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.transporteur-card:hover {
  border-color: #1f2937;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.transporteur-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f3f4f6;
}

.transporteur-title {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.transporteur-logo-big {
  font-size: 2.5rem;
}

.transporteur-title h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.transporteur-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.transporteur-status.actif {
  background: #dcfce7;
  color: #15803d;
}

.transporteur-status.inactif {
  background: #f3f4f6;
  color: #6b7280;
}

.switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e7eb;
  transition: 0.3s;
  border-radius: 28px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked+.slider {
  background-color: #10b981;
}

input:checked+.slider:before {
  transform: translateX(24px);
}

.transporteur-info {
  margin-bottom: 1.5rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.info-value {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 600;
}

.transporteur-tarifs {
  margin-bottom: 1.5rem;
}

.transporteur-tarifs h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.tarifs-list {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0.5rem;
}

.tarif-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.tarif-row:last-child {
  border-bottom: none;
}

.tarif-poids {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 600;
}

.tarif-prix {
  font-size: 0.875rem;
  color: #1f2937;
  font-weight: 700;
}

.transporteur-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-transporteur-config,
.btn-transporteur-stats {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  transition: all 0.2s;
}

.btn-transporteur-config:hover,
.btn-transporteur-stats:hover {
  background: #f9fafb;
  border-color: #1f2937;
}

/* Quick Access */
.quick-access {
  margin-top: 2rem;
}

.quick-access h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.quick-access-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.quick-access-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-access-card:hover {
  border-color: #1f2937;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.quick-access-card svg {
  color: #1f2937;
}

.quick-access-card span {
  font-weight: 600;
  color: #374151;
  text-align: center;
}

/* Filter Tabs */
.users-filters,
.ventes-filters,
.avis-filters {
  margin-bottom: 2rem;
}

.filter-tabs {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-tab:hover {
  border-color: #d1d5db;
  background: white;
}

.filter-tab.active {
  background: #1f2937;
  border-color: #1f2937;
  color: white;
}

/* Finance Cards */
.finance-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.finance-card {
  padding: 2rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  text-align: center;
  transition: all 0.3s;
}

.finance-card:hover {
  border-color: #1f2937;
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.finance-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 16px;
  color: white;
}

.finance-icon.stripe-icon {
  background: linear-gradient(135deg, #635bff 0%, #4f46e5 100%);
}

.finance-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.finance-card p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  border-color: #1f2937;
  background: #1f2937;
  color: white;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 0 1rem;
  }

  .header-content h1 {
    font-size: 1.75rem;
  }

  .tabs-navigation {
    flex-direction: column;
  }

  .commissions-grid,
  .simulator-inputs {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .btn-save {
    width: 100%;
    justify-content: center;
  }
}

/* Formulaires Section */
.formulaires-section {
  animation: fadeIn 0.3s ease-in;
}

/* Sélecteur de catégorie pour formulaires */
.form-category-selector {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 2px solid #e5e7eb;
}

.selector-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.3rem;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.selector-description {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.category-selector-controls {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.selector-mode {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.radio-label {
  display: flex;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
  background: #f8f9fa;
}

.radio-label:hover {
  border-color: #1f2937;
  background: white;
}

.radio-label input[type="radio"] {
  margin-right: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.radio-label input[type="radio"]:checked {
  accent-color: #1f2937;
}

.radio-label:has(input:checked) {
  border-color: #1f2937;
  background: #f8f9fa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.radio-content svg {
  color: #1f2937;
  flex-shrink: 0;
}

.radio-content>div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.radio-content strong {
  color: #1f2937;
  font-size: 1rem;
}

.radio-content span {
  color: #6b7280;
  font-size: 0.85rem;
}

.category-dropdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-dropdown label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.category-select {
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1f2937;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.category-select:hover {
  border-color: #1f2937;
}

.category-select:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.selected-category-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 12px;
  color: white;
}

.badge-label {
  font-size: 0.9rem;
  opacity: 0.9;
}

.badge-category {
  font-weight: 700;
  font-size: 1.1rem;
}

.form-config-card,
.form-preview-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 2rem;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.card-subtitle {
  display: block;
  color: #6b7280;
  font-size: 0.95rem;
}

.fields-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field-item {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.2s;
}

.field-item:hover {
  background: #f1f3f5;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.field-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.field-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.field-icon {
  color: #1f2937;
  flex-shrink: 0;
}

.field-details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field-label {
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.field-type {
  font-size: 0.85rem;
  color: #6b7280;
}

.field-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.required-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
  cursor: pointer;
  user-select: none;
}

.required-toggle input {
  cursor: pointer;
}

.btn-expand {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  border-radius: 8px;
}

.btn-expand:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-expand svg {
  transition: transform 0.2s;
}

.btn-expand svg.rotated {
  transform: rotate(180deg);
}

.field-config {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.config-row {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-row label {
  font-size: 0.9rem;
  color: #374151;
  font-weight: 500;
}

.config-input {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.config-input:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.checkbox-group {
  display: flex;
  gap: 1rem;
  flex-direction: row;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
}

.checkbox-label input {
  cursor: pointer;
}

/* Aperçu */
.preview-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
}

.preview-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-field label {
  font-weight: 600;
  color: #1f2937;
  font-size: 0.95rem;
}

.required-star {
  color: #ef4444;
  margin-left: 0.25rem;
}

.preview-input,
.preview-textarea,
.preview-select {
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  color: #6b7280;
}

.preview-textarea {
  resize: vertical;
  min-height: 100px;
}

.preview-help {
  font-size: 0.85rem;
  color: #6b7280;
  font-style: italic;
}

.preview-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #6b7280;
  cursor: not-allowed;
}

.preview-radio-group {
  display: flex;
  gap: 1.5rem;
}

.preview-radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: not-allowed;
  user-select: none;
  color: #6b7280;
}

/* Animations */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 500px;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Header Actions */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-add-field {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-add-field:hover {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Champs personnalisés */
.custom-field {
  border-left: 4px solid #1f2937;
  background: #f1f5f9;
}

.custom-field:hover {
  background: #e2e8f0;
}

.default-field {
  border-left: 4px solid #6b7280;
}

.btn-delete {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #dc2626;
  transition: all 0.2s;
  border-radius: 8px;
}

.btn-delete:hover {
  background: #fee2e2;
  color: #991b1b;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-in;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 2rem 2rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  border-radius: 8px;
}

.btn-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input,
.form-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1f2937;
  box-shadow: 0 0 0 3px rgba(31, 41, 55, 0.1);
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-cancel {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #d1d5db;
  color: #374151;
}

.btn-confirm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: #374151;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.preview-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}

/* Styles Avis */
.avis-section {
  padding: 2rem;
}

.avis-stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.avis-stat-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.avis-stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.stat-icon-avis {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: white;
}

.stat-icon-avis.total {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon-avis.particuliers {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-icon-avis.professionnels {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon-avis.signales {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.notes-distribution {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.notes-distribution h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.notes-bars {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.note-bar-item {
  display: grid;
  grid-template-columns: 100px 1fr 50px;
  align-items: center;
  gap: 1rem;
}

.note-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.note-bar-container {
  background: #f3f4f6;
  height: 24px;
  border-radius: 12px;
  overflow: hidden;
}

.note-bar {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
  transition: width 0.3s ease;
}

.note-bar.warning {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.note-bar.danger {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.note-count {
  text-align: right;
  font-weight: 600;
  color: #1f2937;
}

.avis-filters {
  margin-bottom: 2rem;
}

.avis-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.avis-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.avis-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.avis-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.avis-user-info {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.avis-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e5e7eb;
}

.avis-user-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.avis-user-name {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.type-badge-avis {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.type-badge-avis.particulier {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge-avis.professionnel {
  background: #ede9fe;
  color: #6b21a8;
}

.avis-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.separator {
  color: #d1d5db;
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: #059669;
  font-weight: 500;
}

.avis-header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avis-rating {
  display: flex;
  gap: 0.25rem;
}

.avis-rating svg.filled {
  color: #fbbf24;
}

.avis-statut-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.avis-statut-badge.publie {
  background: #d1fae5;
  color: #065f46;
}

.avis-statut-badge.en_attente {
  background: #fef3c7;
  color: #92400e;
}

.signale-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.75rem;
  font-weight: 500;
}

.avis-body {
  margin-bottom: 1rem;
}

.avis-titre {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.avis-commentaire {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.avis-signalement {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef2f2;
  border-left: 3px solid #ef4444;
  border-radius: 6px;
  margin-bottom: 1rem;
  color: #991b1b;
  font-size: 0.875rem;
}

.avis-destinataire {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.label-dest {
  color: #6b7280;
}

.dest-name {
  font-weight: 600;
  color: #1f2937;
}

.type-badge-avis-small {
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 500;
}

.type-badge-avis-small.particulier {
  background: #dbeafe;
  color: #1e40af;
}

.type-badge-avis-small.professionnel {
  background: #ede9fe;
  color: #6b21a8;
}

.avis-reponse {
  background: #f0fdf4;
  border-left: 3px solid #10b981;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
}

.reponse-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.reponse-label {
  font-weight: 600;
  color: #065f46;
  font-size: 0.875rem;
}

.reponse-date {
  font-size: 0.75rem;
  color: #6b7280;
}

.reponse-texte {
  color: #374151;
  line-height: 1.5;
  font-size: 0.875rem;
}

.avis-actions {
  display: flex;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
}

.btn-avis-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-avis-action:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-avis-action.approve {
  background: #d1fae5;
  color: #065f46;
  border-color: #10b981;
}

.btn-avis-action.approve:hover {
  background: #a7f3d0;
}

.btn-avis-action.reject {
  background: #fee2e2;
  color: #991b1b;
  border-color: #ef4444;
}

.btn-avis-action.reject:hover {
  background: #fecaca;
}

.btn-avis-action.delete {
  color: #dc2626;
  border-color: #fca5a5;
}

.btn-avis-action.delete:hover {
  background: #fee2e2;
}

.btn-avis-action.view {
  color: #2563eb;
  border-color: #93c5fd;
}

.btn-avis-action.view:hover {
  background: #dbeafe;
}
</style>
