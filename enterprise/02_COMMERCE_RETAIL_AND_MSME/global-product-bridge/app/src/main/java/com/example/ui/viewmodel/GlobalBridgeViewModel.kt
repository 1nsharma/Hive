package com.example.ui.viewmodel

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.local.GlobalBridgeDatabase
import com.example.data.model.CapitalPlan
import com.example.data.model.FounderIdentity
import com.example.data.model.GlobalPartner
import com.example.data.model.LaunchProject
import com.example.data.model.TrustEvidence
import com.example.data.repository.GlobalBridgeRepository
import com.example.service.DocxExportService
import com.example.service.GeminiGlobalizationService
import com.example.service.GlobalizationAnalysis
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import java.io.File

enum class GlobalTab(val title: String) {
    LAUNCH_PROJECTS("Launch OS"),
    TRUST_PROFILE("Trust Profile"),
    PARTNER_GRAPH("Partner Graph"),
    CAPITAL_ENGINE("Capital Engine"),
    CONTEXT_GRAPH("Identity Graph")
}

sealed interface AiAnalysisUiState {
    data object Idle : AiAnalysisUiState
    data object Loading : AiAnalysisUiState
    data class Success(val analysis: GlobalizationAnalysis) : AiAnalysisUiState
    data class Error(val message: String) : AiAnalysisUiState
}

class GlobalBridgeViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: GlobalBridgeRepository = GlobalBridgeRepository(
        GlobalBridgeDatabase.getDatabase(application)
    )

    val activeTab = MutableStateFlow(GlobalTab.LAUNCH_PROJECTS)
    val selectedProjectId = MutableStateFlow("india-france-fragrance")
    val evidenceFilter = MutableStateFlow("ALL")
    val partnerSearchQuery = MutableStateFlow("")

    val showAiAdvisorSheet = MutableStateFlow(false)
    val showDocxPreviewDialog = MutableStateFlow(false)

    val aiAnalysisState = MutableStateFlow<AiAnalysisUiState>(AiAnalysisUiState.Idle)
    val isExportingDocx = MutableStateFlow(false)
    val lastExportedFile = MutableStateFlow<File?>(null)
    val toastMessage = MutableStateFlow<String?>(null)

    val allProjects: StateFlow<List<LaunchProject>> = repository.allProjects
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    val selectedProject: StateFlow<LaunchProject?> = selectedProjectId.flatMapLatest { id ->
        repository.getProjectById(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    val projectEvidence: StateFlow<List<TrustEvidence>> = combine(
        selectedProjectId.flatMapLatest { id -> repository.getEvidenceForProject(id) },
        evidenceFilter
    ) { list, filter ->
        when (filter) {
            "VERIFIED" -> list.filter { it.status == "VERIFIED" }
            "IN_REVIEW" -> list.filter { it.status == "IN_REVIEW" }
            "ACTION_REQUIRED" -> list.filter { it.status == "ACTION_REQUIRED" }
            else -> list
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val allPartners: StateFlow<List<GlobalPartner>> = combine(
        repository.allPartners,
        partnerSearchQuery
    ) { list, query ->
        if (query.isBlank()) list
        else list.filter {
            it.name.contains(query, ignoreCase = true) ||
            it.role.contains(query, ignoreCase = true) ||
            it.organization.contains(query, ignoreCase = true) ||
            it.location.contains(query, ignoreCase = true)
        }
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    @OptIn(kotlinx.coroutines.ExperimentalCoroutinesApi::class)
    val capitalPlan: StateFlow<CapitalPlan?> = selectedProjectId.flatMapLatest { id ->
        repository.getCapitalPlanForProject(id)
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    val primaryIdentity: StateFlow<FounderIdentity?> = repository.primaryIdentity
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    init {
        viewModelScope.launch {
            repository.initializeSeedDataIfNeeded()
        }
    }

    fun selectTab(tab: GlobalTab) {
        activeTab.value = tab
    }

    fun selectProject(projectId: String) {
        selectedProjectId.value = projectId
    }

    fun setEvidenceFilter(filter: String) {
        evidenceFilter.value = filter
    }

    fun setPartnerSearchQuery(query: String) {
        partnerSearchQuery.value = query
    }

    fun toggleEvidenceStatus(evidence: TrustEvidence) {
        viewModelScope.launch {
            val nextStatus = when (evidence.status) {
                "VERIFIED" -> "IN_REVIEW"
                "IN_REVIEW" -> "ACTION_REQUIRED"
                else -> "VERIFIED"
            }
            repository.updateEvidenceStatus(evidence.id, nextStatus)
        }
    }

    fun exportAndShareDocx(context: Context) {
        val currentProject = selectedProject.value ?: return
        viewModelScope.launch {
            isExportingDocx.value = true
            try {
                val file = DocxExportService.generateDocx(
                    context = context,
                    project = currentProject,
                    evidenceList = projectEvidence.value,
                    partnerList = allPartners.value,
                    capitalPlan = capitalPlan.value
                )
                lastExportedFile.value = file
                isExportingDocx.value = false
                toastMessage.value = "DOCX Generated Successfully!"
                DocxExportService.shareDocx(context, file)
            } catch (e: Exception) {
                isExportingDocx.value = false
                toastMessage.value = "Error generating DOCX: ${e.message}"
            }
        }
    }

    fun runGlobalizationAnalysis(
        productName: String,
        originCountry: String,
        targetCountry: String,
        category: String
    ) {
        viewModelScope.launch {
            aiAnalysisState.value = AiAnalysisUiState.Loading
            try {
                val analysis = GeminiGlobalizationService.analyzeLaunchCorridor(
                    productName = productName,
                    originCountry = originCountry,
                    targetCountry = targetCountry,
                    category = category
                )
                aiAnalysisState.value = AiAnalysisUiState.Success(analysis)
            } catch (e: Exception) {
                aiAnalysisState.value = AiAnalysisUiState.Error(e.message ?: "Failed to generate globalization analysis")
            }
        }
    }

    fun clearToast() {
        toastMessage.value = null
    }
}
