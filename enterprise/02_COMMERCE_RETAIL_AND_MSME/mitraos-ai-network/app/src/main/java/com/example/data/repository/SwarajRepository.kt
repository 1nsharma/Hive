package com.example.data.repository

import com.example.BuildConfig
import com.example.data.api.Content
import com.example.data.api.GenerateContentRequest
import com.example.data.api.Part
import com.example.data.api.RetrofitClient
import com.example.data.database.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.withContext
import java.text.SimpleDateFormat
import java.util.*

class SwarajRepository(private val dao: SwarajDao) {

    val allCourses: Flow<List<TrainingCourse>> = dao.getAllCourses()
    val allWorlds: Flow<List<CustomWorld>> = dao.getAllWorlds()
    val allCertifications: Flow<List<UserCertification>> = dao.getAllCertifications()

    fun observeWallet(email: String): Flow<UserWallet?> {
        return dao.observeWallet(email)
    }

    suspend fun getOrCreateWallet(email: String, isFounder: Boolean = false): UserWallet {
        return withContext(Dispatchers.IO) {
            val existing = dao.getWallet(email)
            if (existing != null) {
                if (existing.isFounder != isFounder) {
                    val updated = existing.copy(isFounder = isFounder)
                    dao.insertOrUpdateWallet(updated)
                    updated
                } else {
                    existing
                }
            } else {
                val newWallet = UserWallet(
                    email = email,
                    rewardPoints = 250,
                    isFounder = isFounder
                )
                dao.insertOrUpdateWallet(newWallet)
                newWallet
            }
        }
    }

    suspend fun updateWalletBalance(email: String, pointsToAdd: Int, claimedGrant: Double = 0.0) {
        withContext(Dispatchers.IO) {
            val wallet = dao.getWallet(email) ?: UserWallet(email = email)
            val updated = wallet.copy(
                rewardPoints = wallet.rewardPoints + pointsToAdd,
                claimedGrantValue = wallet.claimedGrantValue + claimedGrant
            )
            dao.insertOrUpdateWallet(updated)
        }
    }

    suspend fun completeCourseAndReward(email: String, courseId: String, courseTitle: String, rewardAmount: Int) {
        withContext(Dispatchers.IO) {
            // 1. Update Room DB Course Completion
            dao.updateCourseCompletion(courseId, true)

            // 2. Add points to User Wallet
            updateWalletBalance(email, rewardAmount)

            // 3. Generate Certificate
            val dateFormat = SimpleDateFormat("dd MMM yyyy", Locale.getDefault())
            val dateStr = dateFormat.format(Date())
            val codeStr = "SWARAJ-${courseId.uppercase()}-${(1000..9999).random()}"
            val txHashStr = "0x" + UUID.randomUUID().toString().replace("-", "").take(16)

            dao.insertCertification(
                UserCertification(
                    courseId = courseId,
                    title = courseTitle,
                    earnerEmail = email,
                    dateEarned = dateStr,
                    badgeCode = codeStr,
                    txHash = txHashStr
                )
            )
        }
    }

    suspend fun saveCustomWorld(world: CustomWorld) {
        withContext(Dispatchers.IO) {
            dao.insertCustomWorld(world)
        }
    }

    suspend fun saveNotes(courseId: String, notes: String) {
        withContext(Dispatchers.IO) {
            dao.updateCourseNotes(courseId, notes)
        }
    }

    /**
     * Seeds initial Indian-focused regional AI simulation modules if empty
     */
    suspend fun seedInitialCoursesIfEmpty() {
        withContext(Dispatchers.IO) {
            val existing = dao.getAllCourses().firstOrNull()
            if (existing.isNullOrEmpty()) {
                val initialList = listOf(
                    TrainingCourse(
                        id = "agri_tamilnadu",
                        title = "Tamil Nadu Solar Microgrids",
                        category = "Agri-AI & CleanTech",
                        indianProblemState = "Smallholder farms in regional Coimbatore experience variable monsoonal irrigation outages. Underutilized local solar mini-grids lack real-time predictive battery state modeling.",
                        googleAiTechStack = "Gemini API (Restructured power-state forecasts) + Linear Optimization",
                        solutionBrief = "Implement a localized forecast scheduler that reads regional cloud cover vectors and prioritizes drip-irrigation pumps dynamically during sub-peak load hours, avoiding power grid failure.",
                        difficulty = "Intermediate",
                        earnedReward = 200,
                        simulationSnippet = "Fun Fact: Standardizing smart microgrid optimization across Tamil Nadu can reduce crop dehydration fatalities by up to 28% while saving peak grid loads.",
                        quizQuestion = "During high cloud-cover monsoonal hours, how should the smart AI scheduling engine allocate battery power?",
                        quizOptionA = "Shut down all backup battery reserves completely to prevent damage.",
                        quizOptionB = "Prioritize high-draw irrigation pumps exclusively using immediate peak grid power.",
                        quizOptionC = "Reschedule microgrid load to low-draw critical sensors and throttle heavy pumps till cloud vectors clear.",
                        quizCorrectAnswer = "C",
                        userNotes = ""
                    ),
                    TrainingCourse(
                        id = "edu_bhashini",
                        title = "Bhashini High-Fidelity Translator",
                        category = "Vernacular AI Edu",
                        indianProblemState = "Rural schools across central Bihar suffer high attrition due to lack of standard textbook translations in local dialects (e.g., Magahi, Angika), which are overlooked by central translation APIs.",
                        googleAiTechStack = "Bhashini APIS + Gemini 3.5 Flash (Vernacular Dialect Alignment)",
                        solutionBrief = "A localized speech-to-speech assistant enabling rural teachers to input standard Hindi curriculum, instantly trans-synthesizing it into regional Magahi vocal cues with real-time feedback loops.",
                        difficulty = "Beginner",
                        earnedReward = 150,
                        simulationSnippet = "Concept: Regional Magahi dialects rely heavily on visual agricultural parables. Gemini helps align textbook math with local farming stories.",
                        quizQuestion = "To retain semantic engagement in vernacular schools, what is Gemini's primary contribution to Magahi translation?",
                        quizOptionA = "Translating the text word-for-word into formal Sanskrit directly.",
                        quizOptionB = "Aligning technical math concepts with localized metaphors and regional dialect contexts.",
                        quizOptionC = "Muting native audio to enforce English language textbook usage.",
                        quizCorrectAnswer = "B",
                        userNotes = ""
                    ),
                    TrainingCourse(
                        id = "health_ayush",
                        title = "AYUSH Diabetes Predictor & Herb Ledger",
                        category = "Rural Health AI",
                        indianProblemState = "Village clinics in remote Uttarakhand lack specialists for diabetic neuropathy screening. Meanwhile, traditional remedies are unregistered, slowing medical evidence and ledger research.",
                        googleAiTechStack = "Gemini multimodal classification + Distributed Local Databases",
                        solutionBrief = "Screen patients via dynamic questionnaires translating classical Ayurvedic 'Prakriti' and early dermal indices into algorithmic diabetes risk factors, with safe herbal recommendations.",
                        difficulty = "Advanced",
                        earnedReward = 250,
                        simulationSnippet = "Advanced: Real-time analysis of traditional medicine combined with clinical indexes enhances safety for pre-diabetic rural cohorts.",
                        quizQuestion = "Which approach ensures clinical-grade safety when combining AI with traditional AYUSH herbal indices?",
                        quizOptionA = "Replace doctor visits entirely with autonomous unregulated herbal prescriptions.",
                        quizOptionB = "Run multimodal risk scoring through local models that cross-reference registered toxicological databases first.",
                        quizOptionC = "Hide all traditional records to bypass clinical validation standards.",
                        quizCorrectAnswer = "B",
                        userNotes = ""
                    ),
                    TrainingCourse(
                        id = "waste_swachh",
                        title = "Varanasi Smart Waste Analytics",
                        category = "Swachh Bharat CleanTech",
                        indianProblemState = "High-concentration organic waste at the Varanasi Ghats overflows regional bins before municipal trucks arrive, causing secondary silting in the Ganges riverbed.",
                        googleAiTechStack = "Object Detection + Gemini Smart Route Optimization Optimizer",
                        solutionBrief = "Deploy smart optical sensor streams on regional bins. Gemini computes truck redirection strategies dynamically to prevent river spillages of organic and medical runoffs.",
                        difficulty = "Intermediate",
                        earnedReward = 180,
                        simulationSnippet = "Insight: Pre-sorting organic silt yields 40% higher compost recovery while keeping holy ghat steps free from hazardous runoff.",
                        quizQuestion = "What sensor state triggers the highest urgency score in the smart Varanasi river waste routing system?",
                        quizOptionA = "High levels of non-biodegradable compostable plastic sitting dry.",
                        quizOptionB = "A wet organic bin near the ghat water line reaching 85% volumetric fill.",
                        quizOptionC = "A clean bin that hasn't seen any deposits in a calendar week.",
                        quizCorrectAnswer = "B",
                        userNotes = ""
                    ),
                    TrainingCourse(
                        id = "fintech_rural",
                        title = "Rural Lakhpati Didi Micro-Lending",
                        category = "FinTech Swaraj",
                        indianProblemState = "Rural self-help groups (SHGs) under the Lakhpati Didi initiative across Rajasthan face credit exclusions because standard algorithmic credit bureau scores ignore cash-based village trade histories.",
                        googleAiTechStack = "Gemini API (Dynamic socio-economic asset classification) + Transaction Ledgering",
                        solutionBrief = "Establish alternative credibility scores by querying group heads on weekly dairy deposits and community grain assets. Gemini generates audit-ready capital trust profiles.",
                        difficulty = "Intermediate",
                        earnedReward = 200,
                        simulationSnippet = "DeFi Impact: Peer-group trust ledgers reduce transaction defaults to less than 0.9% across Rajasthan micro-businesses.",
                        quizQuestion = "How does this system generate credibility scores for credit-excluded rural self-help groups?",
                        quizOptionA = "By purchasing external credit profiles of urban tech employees.",
                        quizOptionB = "Generating trusted profiles by auditing dynamic socio-economic histories and localized agricultural deposit flows.",
                        quizOptionC = "Requiring physical gold collateral from the group before allowing login.",
                        quizCorrectAnswer = "B",
                        userNotes = ""
                    )
                )
                dao.insertCourses(initialList)
            }
        }
    }

    /**
     * Executes queries directly to Gemini API via HTTP
     */
    suspend fun evaluateSimulationResponse(courseTitle: String, userSolution: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "API Key Missing. Set your GEMINI_API_KEY in the AI Studio Secrets panel. Evaluated Simulated Response: Your innovative proposal for '$courseTitle' demonstrates excellent regional focus! Your idea can be successfully applied to mitigate the regional crisis."
        }

        val systemPrompt = "You are Swaraj AI Dean, a senior Indian AI solutions architect specialized in localized tech stack optimization for regional challenges. Give structured, constructive, elegant reviews (2-3 sentences max) evaluating the feasibility of the user's idea."
        val prompt = "Evaluate this proposal for the challenge '$courseTitle'. User proposed: '$userSolution'. Analyze what makes it great and give 1 expert localized recommendation."

        val request = GenerateContentRequest(
            contents = listOf(Content(parts = listOf(Part(text = prompt)))),
            systemInstruction = Content(parts = listOf(Part(text = systemPrompt)))
        )

        try {
            val response = RetrofitClient.service.generateContent("gemini-3.5-flash", apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text ?: "Evaluation completed successfully!"
        } catch (e: Exception) {
            "Simulated dean feedback: Your approach to '$courseTitle' is highly practical and displays deep systemic understanding. Continue working on hardware interface parameters."
        }
    }

    /**
     * Generates an entire Custom AI World from a user idea prompt
     */
    suspend fun generateCustomWorld(industry: String, customPrompt: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext """
                {
                  "technical_architecture": "Google Cloud Run + Bhashini Translation Engines",
                  "apis_used": "Gemini 3.5 Flash Model + Google Maps SDK (Static Map)",
                  "milestones": "1. Deploy native local dialects, 2. Pilot local SHG groups, 3. Sync DeFi reward ledger.",
                  "regional_impact": "Generates 25% higher community commerce income and solves access barriers.",
                  "solution_summary": "Simulated Blueprint because API Key is not set yet. Your concept on '$customPrompt' in '$industry' is beautiful. Once you enter your API Key in the Secrets panel, the Dean will write a fully detailed dynamic blockchain-aligned tech architecture for you!"
                }
            """.trimIndent()
        }

        val systemPrompt = """
            You are 'Swaraj World Maker'. The user wants to build a custom AI World in India addressing regional issues.
            Generate a JSON object containing five text fields, and ONLY the raw JSON object. Do not include markdown wraps or ```json indicators. Just the JSON text:
            {
              "technical_architecture": "string describing Gcloud, databases, endpoints",
              "apis_used": "string listing google ai translation, models",
              "milestones": "string listing 3-step action layout",
              "regional_impact": "string of social and financial benefit",
              "solution_summary": "string of 2 paragraphs outlining the dynamic plan"
            }
        """.trimIndent()

        val prompt = "Create a Swaraj AI World model for Industry '$industry'. Problem statement: '$customPrompt'. Focus on Indian context and solutions."

        val request = GenerateContentRequest(
            contents = listOf(Content(parts = listOf(Part(text = prompt)))),
            systemInstruction = Content(parts = listOf(Part(text = systemPrompt)))
        )

        try {
            val response = RetrofitClient.service.generateContent("gemini-3.5-flash", apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text ?: ""
        } catch (e: Exception) {
            """
                {
                  "technical_architecture": "Gemini Model Orchestrator + SQLite Cache",
                  "apis_used": "Gemini 3.5 Flash Model",
                  "milestones": "1. Deploy prototype, 2. Add local training, 3. Certify core villagers",
                  "regional_impact": "Solves access and technology training directly",
                  "solution_summary": "Failed to call Gemini API client: ${e.message}. Your proposal represents a highly viable ecosystem for $industry."
                }
            """.trimIndent()
        }
    }

    /**
     * Mitra Voice Tutor interactive conversation handler via Gemini API
     */
    suspend fun queryVoiceTutor(userMessage: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "API Key is not set. Simulated Voice Tutor reply: To construct the best India-first prompt for Bhashini language translations, you should always give clear system directives specifying the regional dialect context (e.g. Marathi or Magahi context) so Gemini aligns perfectly!"
        }

        val systemPrompt = "You are 'Mitra Voice AI Tutor', speaking affectionately to an active Indian digital trainee. Answer their question elegantly under 3 sentences, using brief voice-friendly instructions."
        val request = GenerateContentRequest(
            contents = listOf(Content(parts = listOf(Part(text = userMessage)))),
            systemInstruction = Content(parts = listOf(Part(text = systemPrompt)))
        )

        try {
            val response = RetrofitClient.service.generateContent("gemini-3.5-flash", apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text ?: "I am listening closely, let's explore more AI tools!"
        } catch (e: Exception) {
            "Simulated Voice Tutor reply: That's a great question about prompting and Bhashini AI! Be sure to specify the regional context in your prompt parameters."
        }
    }

    /**
     * AI Sandbox Prompt Optimizer via Gemini API
     */
    suspend fun optimizeSandboxPrompt(rawPrompt: String, strategy: String): String = withContext(Dispatchers.IO) {
        val apiKey = BuildConfig.GEMINI_API_KEY
        if (apiKey.isEmpty() || apiKey == "MY_GEMINI_API_KEY") {
            return@withContext "Simulated Optimized Prompt (No API key): [System: You are an expert Local $strategy. Output clear Marathi instructions for drip water metrics]\n\nOriginal prompt: '$rawPrompt'\n\nHighly optimized with 1-shot examples for sub-peak solar battery states."
        }

        val systemPrompt = "You are 'Mitra Prompt Architect'. Build a highly polished, production-ready system prompt model depending on the requested strategy: '$strategy'. Output ONLY the fully optimized markdown prompt template, and explain how it helps under 2 sentences."
        val request = GenerateContentRequest(
            contents = listOf(Content(parts = listOf(Part(text = "Please optimize this prompt: '$rawPrompt' under the optimization strategy '$strategy'")))),
            systemInstruction = Content(parts = listOf(Part(text = systemPrompt)))
        )

        try {
            val response = RetrofitClient.service.generateContent("gemini-3.5-flash", apiKey, request)
            response.candidates?.firstOrNull()?.content?.parts?.firstOrNull()?.text ?: "Failed to generate optimized prompt."
        } catch (e: Exception) {
            "Optimization backup model: [SYSTEM: Localizer strategy enabled for '$strategy']\n\nPrompt details: $rawPrompt"
        }
    }
}
