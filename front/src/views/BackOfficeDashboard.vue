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

        <!-- Onglet Commissions -->
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
            <button class="btn-save">
              <Plus :size="20" />
              Ajouter une catégorie
            </button>
          </div>
          <p class="placeholder-text">Ajout/modification/suppression de catégories - En développement</p>
        </div>

        <!-- Onglet Utilisateurs -->
        <div v-if="activeTab === 'utilisateurs'" class="utilisateurs-section">
          <div class="section-header">
            <h2>
              <Users :size="24" />
              Gestion des Utilisateurs
            </h2>
          </div>

          <div class="users-filters">
            <div class="filter-tabs">
              <button @click="userFilter = 'tous'" :class="{ active: userFilter === 'tous' }" class="filter-tab">
                Tous
              </button>
              <button @click="userFilter = 'particuliers'" :class="{ active: userFilter === 'particuliers' }"
                class="filter-tab">
                Particuliers
              </button>
              <button @click="userFilter = 'professionnels'" :class="{ active: userFilter === 'professionnels' }"
                class="filter-tab">
                Professionnels
              </button>
              <button @click="userFilter = 'bloques'" :class="{ active: userFilter === 'bloques' }" class="filter-tab">
                Bloqués
              </button>
            </div>
          </div>

          <p class="placeholder-text">Liste des utilisateurs avec actions (bloquer/débloquer, créer accès) - En
            développement</p>
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
                Toutes
              </button>
              <button @click="venteFilter = 'encheres-cours'" :class="{ active: venteFilter === 'encheres-cours' }"
                class="filter-tab">
                <Gavel :size="16" />
                Enchères en cours
              </button>
              <button @click="venteFilter = 'encheres-terminees'"
                :class="{ active: venteFilter === 'encheres-terminees' }" class="filter-tab">
                <Gavel :size="16" />
                Enchères terminées
              </button>
              <button @click="venteFilter = 'ventes-rapides'" :class="{ active: venteFilter === 'ventes-rapides' }"
                class="filter-tab">
                <Zap :size="16" />
                Ventes rapides
              </button>
            </div>
          </div>

          <p class="placeholder-text">Liste complète des ventes avec filtres - En développement</p>
        </div>

        <!-- Onglet Finance -->
        <div v-if="activeTab === 'finance'" class="finance-section">
          <div class="section-header">
            <h2>
              <Banknote :size="24" />
              Gestion Financière
            </h2>
          </div>

          <div class="finance-cards">
            <div class="finance-card">
              <div class="finance-icon">
                <Calculator :size="32" />
              </div>
              <h3>Comptabilité</h3>
              <p>Accès aux rapports comptables et transactions</p>
              <button class="btn-secondary">
                <FileText :size="18" />
                Voir les rapports
              </button>
            </div>

            <div class="finance-card">
              <div class="finance-icon stripe-icon">
                <CreditCard :size="32" />
              </div>
              <h3>Gestion Stripe</h3>
              <p>Configuration et suivi des paiements</p>
              <button class="btn-secondary">
                <Settings :size="18" />
                Configurer Stripe
              </button>
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
          <p class="placeholder-text">Suivi et gestion des livraisons - En développement</p>
        </div>

        <!-- Onglet Avis -->
        <div v-if="activeTab === 'avis'" class="avis-section">
          <div class="section-header">
            <h2>
              <Star :size="24" />
              Gestion des Avis
            </h2>
          </div>

          <div class="avis-filters">
            <div class="filter-tabs">
              <button @click="avisFilter = 'tous'" :class="{ active: avisFilter === 'tous' }" class="filter-tab">
                Tous les avis
              </button>
              <button @click="avisFilter = 'particuliers'" :class="{ active: avisFilter === 'particuliers' }"
                class="filter-tab">
                Particuliers
              </button>
              <button @click="avisFilter = 'professionnels'" :class="{ active: avisFilter === 'professionnels' }"
                class="filter-tab">
                Professionnels
              </button>
            </div>
          </div>

          <p class="placeholder-text">Liste des avis clients avec filtres - En développement</p>
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
  ToggleLeft
} from 'lucide-vue-next'

// État
const activeTab = ref('dashboard')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')
const modeModification = ref('global')
const categorieSelectionnee = ref(null)

// Filtres
const userFilter = ref('tous')
const venteFilter = ref('toutes')
const avisFilter = ref('tous')

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
</style>
