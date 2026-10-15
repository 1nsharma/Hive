package com.example.ui.viewmodel

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.database.AppDatabase
import com.example.data.database.CustomWorld
import com.example.data.database.TrainingCourse
import com.example.data.database.UserWallet
import com.example.data.repository.SwarajRepository
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import org.json.JSONObject

sealed interface UiState<out T> {
    object Idle : UiState<Nothing>
    object Loading : UiState<Nothing>
    data class Success<out T>(val data: T) : UiState<T>
    data class Error(val message: String) : UiState<Nothing>
}

class SwarajViewModel(application: Application) : AndroidViewModel(application) {

    private val db = AppDatabase.getDatabase(application)
    private val repository = SwarajRepository(db.swarajDao())

    // UI Tab State: 0 = Solutions Explore, 1 = AI Custom Worlds, 2 = Rewards & Wallets, 3 = Founder Admin Desk
    val currentTab = MutableStateFlow(0)

    // User Profile Simulation (Google Sign-In integration)
    val userEmail = MutableStateFlow("AMITSHARMA99976@gmail.com")
    val userName = MutableStateFlow("Amit Sharma")
    val userPhotoUrl = MutableStateFlow("https://lh3.googleusercontent.com/a/default-user=s120-c")

    // Dynamic Database Flows
    val courses: StateFlow<List<TrainingCourse>> = repository.allCourses
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val customWorlds: StateFlow<List<CustomWorld>> = repository.allWorlds
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val certifications: StateFlow<List<com.example.data.database.UserCertification>> = repository.allCertifications
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // Wallet flow connected dynamically depending on logged in email
    val userWallet: StateFlow<UserWallet?> = userEmail
        .flatMapLatest { email -> repository.observeWallet(email) }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), null)

    // Simulation lab variables
    val selectedCourse = MutableStateFlow<TrainingCourse?>(null)
    val simulationUserIdea = MutableStateFlow("")
    val quizSelectedOption = MutableStateFlow("")
    val isQuizAnswered = MutableStateFlow(false)
    val isQuizAnswerCorrect = MutableStateFlow(false)

    // Gemini states
    val simulationFeedback = MutableStateFlow<String?>(null)
    val isSimulationLoading = MutableStateFlow(false)

    // Voice Tutor States
    val voiceMessages = MutableStateFlow<List<Pair<String, String>>>(
        listOf(
            "Tutor" to "Namaste! I am Mitra Voice AI Tutor. Tell me what AI skill or Google tool you want to learn today (e.g. Prompting, Automation, Indian Languages, Coding)!"
        )
    )
    val isVoiceTutorLoading = MutableStateFlow(false)

    // Sandbox States
    val sandboxPromptResult = MutableStateFlow<String?>(null)
    val isSandboxLoading = MutableStateFlow(false)

    // Garmi Se Jung (Climate Hero Gamification Campaign)
    val userContributions = MutableStateFlow<List<VoluntaryContribution>>(
        listOf(
            VoluntaryContribution("c1", "Roof White Karna", 100, "2026-05-22 14:30", "Verified 120 sq ft with lime-coat before/after photo"),
            VoluntaryContribution("c2", "1 Ped Lagana", 50, "2026-05-22 10:15", "Sapling ID: TR-DLH-998, Location: Dwarka Sect 10")
        )
    )
    val stateLeaderboard = MutableStateFlow<Map<String, Int>>(
        mapOf(
            "Uttar Pradesh" to 42500,
            "Maharashtra" to 38900,
            "Bihar" to 31200,
            "Tamil Nadu" to 28430,
            "Delhi NCR" to 23920,
            "Gujarat" to 21500,
            "Madhya Pradesh" to 19400,
            "Karnataka" to 14200
        )
    )
    val totalCampaignParticipation = MutableStateFlow(219850)
    val currentSelectedUserState = MutableStateFlow("Delhi NCR")

    // AI custom world creator variables
    val creatorIndustry = MutableStateFlow("Agriculture & Soil Care")
    val creatorPrompt = MutableStateFlow("")
    val generatedBlueprint = MutableStateFlow<String?>(null)
    val isBlueprintLoading = MutableStateFlow(false)

    // Founder diagnostics
    val simulatedFounderLiquidity = MutableStateFlow(100000.0) // Virtual reward pool pool value
    val consoleLogs = MutableStateFlow<List<String>>(
        listOf(
            "System initialized on 2026-05-22",
            "Swaraj Smart Contracts listening...",
            "Google Identity provider loaded"
        )
    )

    init {
        viewModelScope.launch {
            repository.seedInitialCoursesIfEmpty()
            // Make sure the wallet exists
            getOrCreateWallet()
        }
    }

    fun selectTab(tabIndex: Int) {
        currentTab.value = tabIndex
    }

    private fun addLog(message: String) {
        val list = consoleLogs.value.toMutableList()
        list.add(0, "[${java.text.SimpleDateFormat("HH:mm:ss", java.util.Locale.getDefault()).format(java.util.Date())}] $message")
        consoleLogs.value = list.take(15) // keep last 15
    }

    fun login(email: String, name: String) {
        viewModelScope.launch {
            userEmail.value = email
            userName.value = name
            getOrCreateWallet()
            addLog("User logged in: $email (${if (isFounder()) "Founder" else "Learner"})")
        }
    }

    fun isFounder(): Boolean {
        return userEmail.value.equals("AMITSHARMA99976@gmail.com", ignoreCase = true)
    }

    private suspend fun getOrCreateWallet() {
        repository.getOrCreateWallet(userEmail.value, isFounder = isFounder())
    }

    fun selectCourseForSimulation(course: TrainingCourse) {
        selectedCourse.value = course
        simulationUserIdea.value = ""
        quizSelectedOption.value = ""
        isQuizAnswered.value = false
        isQuizAnswerCorrect.value = false
        simulationFeedback.value = null
    }

    fun submitQuizAnswer() {
        val course = selectedCourse.value ?: return
        val chosen = quizSelectedOption.value
        val correct = course.quizCorrectAnswer

        isQuizAnswered.value = true
        val isCorrect = chosen.equals(correct, ignoreCase = true)
        isQuizAnswerCorrect.value = isCorrect

        if (isCorrect) {
            viewModelScope.launch {
                repository.completeCourseAndReward(
                    email = userEmail.value,
                    courseId = course.id,
                    courseTitle = course.title,
                    rewardAmount = course.earnedReward
                )
                addLog("Completed quiz for '${course.title}' (+${course.earnedReward} Swaraj Tokens & Certificate Generated)")
            }
        }
    }

    fun evaluateSimulation() {
        val course = selectedCourse.value ?: return
        val proposal = simulationUserIdea.value
        if (proposal.isBlank()) return

        viewModelScope.launch {
            isSimulationLoading.value = true
            addLog("Sending design simulation review for '${course.title}' to Dean AI...")
            val feedback = repository.evaluateSimulationResponse(course.title, proposal)
            simulationFeedback.value = feedback
            isSimulationLoading.value = false
            addLog("Dean AI evaluation loaded.")
        }
    }

    fun saveUserCourseNotes(notes: String) {
        val course = selectedCourse.value ?: return
        viewModelScope.launch {
            repository.saveNotes(course.id, notes)
            // Refresh selected course
            selectedCourse.value = course.copy(userNotes = notes)
            addLog("Saved personal training notes for '${course.title}'")
        }
    }

    fun generateWorldBlueprint() {
        val promptText = creatorPrompt.value
        val indValue = creatorIndustry.value
        if (promptText.isBlank()) return

        viewModelScope.launch {
            isBlueprintLoading.value = true
            generatedBlueprint.value = null
            addLog("Generating Custom Swaraj World scenario: '$indValue'...")

            val rawResult = repository.generateCustomWorld(indValue, promptText)
            generatedBlueprint.value = rawResult
            isBlueprintLoading.value = false

            // Parse title if possible
            var blueprintTitle = "Swaraj AI World Project"
            try {
                val json = JSONObject(rawResult)
                blueprintTitle = json.optString("technical_architecture", "Localized AI System")
                    .take(28) + ".. Blueprint"
            } catch (e: Exception) {
                // fall back
            }

            // Save Custom World to local database
            val customWorld = CustomWorld(
                title = "AI World: " + indValue.replace(" & Soil Care", "").replace(" Education", ""),
                selectedIndustry = indValue,
                problemPrompt = promptText,
                fullArchitectureJson = rawResult
            )
            repository.saveCustomWorld(customWorld)

            // Add points to User Wallet as rewards for generating solutions
            repository.updateWalletBalance(userEmail.value, 100) // 100 points for creation!

            addLog("Successfully initialized local AI World & credited +100 tokens.")
        }
    }

    fun sendVoiceTutorMessage(userMsg: String) {
        if (userMsg.isBlank()) return
        val currentList = voiceMessages.value.toMutableList()
        currentList.add("User" to userMsg)
        voiceMessages.value = currentList

        viewModelScope.launch {
            isVoiceTutorLoading.value = true
            addLog("Queried Mitra Voice Tutor for learning help...")
            val response = repository.queryVoiceTutor(userMsg)
            
            val updatedList = voiceMessages.value.toMutableList()
            updatedList.add("Tutor" to response)
            voiceMessages.value = updatedList
            isVoiceTutorLoading.value = false
            addLog("Mitra Voice Tutor replied.")
        }
    }

    fun optimizeSandboxPrompt(rawPrompt: String, strategy: String) {
        if (rawPrompt.isBlank()) return
        viewModelScope.launch {
            isSandboxLoading.value = true
            addLog("Optimizing custom prompt via Mitra Sandbox...")
            val result = repository.optimizeSandboxPrompt(rawPrompt, strategy)
            sandboxPromptResult.value = result
            isSandboxLoading.value = false
            addLog("Sandbox optimized template generated.")
            repository.updateWalletBalance(userEmail.value, 10)
        }
    }

    fun publishCustomPromptToMarket(title: String, body: String, sector: String) {
        viewModelScope.launch {
            repository.updateWalletBalance(userEmail.value, 20)
            addLog("Published prompt '$title' to MitraOS Marketplace! (+20 SWRAJ points credited)")
        }
    }

    fun redeemPointsForGrant() {
        viewModelScope.launch {
            val emailVal = userEmail.value
            val walletVal = userWallet.value ?: return@launch
            if (walletVal.rewardPoints >= 50) {
                repository.updateWalletBalance(emailVal, -50, 500.0)
                simulatedFounderLiquidity.value = (simulatedFounderLiquidity.value - 500.0).coerceAtLeast(0.0)
                addLog("Redeemed 50 Swaraj Points to simulated grant payout (+₹500)")
            }
        }
    }

    // Founder Admin controls
    fun adminAdjustRewardPool(amount: Double) {
        simulatedFounderLiquidity.value = amount
        addLog("Founder updated simulated project reward pool to: ₹${amount}")
    }

    fun adminMockAirdrop() {
        viewModelScope.launch {
            repository.updateWalletBalance(userEmail.value, 500)
            addLog("Admin initiated custom token standard user bonus of +500 Swaraj Points.")
        }
    }

    fun adminClearAllWorlds() {
        // Simple log clearing
        addLog("Admin system logs diagnostics flushed.")
    }

    fun addGarmiContribution(type: String, details: String, points: Int) {
        viewModelScope.launch {
            val emailVal = userEmail.value
            val timestamp = java.text.SimpleDateFormat("yyyy-MM-dd HH:mm", java.util.Locale.getDefault()).format(java.util.Date())
            val newCont = VoluntaryContribution(
                id = java.util.UUID.randomUUID().toString(),
                type = type,
                pointsEarned = points,
                timestamp = timestamp,
                details = details
            )
            val currentList = userContributions.value.toMutableList()
            currentList.add(0, newCont)
            userContributions.value = currentList

            val activeState = currentSelectedUserState.value
            val updatedMap = stateLeaderboard.value.toMutableMap()
            updatedMap[activeState] = (updatedMap[activeState] ?: 0) + 1
            stateLeaderboard.value = updatedMap

            totalCampaignParticipation.value = totalCampaignParticipation.value + 1

            repository.updateWalletBalance(emailVal, points)
            addLog("Logged Action: $type (+$points SWRAJ registered on MitraOS secure ledger для $activeState)")
        }
    }
}

data class VoluntaryContribution(
    val id: String,
    val type: String,
    val pointsEarned: Int,
    val timestamp: String,
    val details: String
)

