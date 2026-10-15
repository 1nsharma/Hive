package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.*
import androidx.compose.material3.TabRowDefaults.tabIndicatorOffset
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.database.TrainingCourse
import com.example.ui.viewmodel.SwarajViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun ExploreLabScreen(
    viewModel: SwarajViewModel,
    modifier: Modifier = Modifier
) {
    val courses by viewModel.courses.collectAsStateWithLifecycle()
    val selectedCourse by viewModel.selectedCourse.collectAsStateWithLifecycle()

    var activeSubTab by remember { mutableStateOf("academy") } // "academy", "voice", "sandbox", "marketplace"

    Box(modifier = modifier.fillMaxSize()) {
        if (selectedCourse == null) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Header Block
                item {
                    Text(
                        text = "MITRAOS DIGITAL ACADEMY",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.5.sp
                    )
                    Text(
                        text = "AI Learning Hub",
                        style = MaterialTheme.typography.headlineMedium,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = "Master prompt engineering, workflow automation, and regional language models. Earn reputation index scores on SQLite database ledger.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 4.dp, bottom = 4.dp)
                    )
                }

                // Sub module selector Tabs Row (Material 3 standard layout)
                item {
                    ScrollableTabRow(
                        selectedTabIndex = when (activeSubTab) {
                            "academy" -> 0
                            "voice" -> 1
                            "sandbox" -> 2
                            else -> 3
                        },
                        edgePadding = 0.dp,
                        containerColor = Color.Transparent,
                        divider = {},
                        indicator = { tabPositions ->
                            TabRowDefaults.SecondaryIndicator(
                                modifier = Modifier.tabIndicatorOffset(
                                    tabPositions[when (activeSubTab) {
                                        "academy" -> 0
                                        "voice" -> 1
                                        "sandbox" -> 2
                                        else -> 3
                                    }]
                                ),
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                    ) {
                        Tab(
                            selected = activeSubTab == "academy",
                            onClick = { activeSubTab = "academy" },
                            text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Home, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Solutions Lab", fontWeight = FontWeight.Bold)
                            }}
                        )
                        Tab(
                            selected = activeSubTab == "voice",
                            onClick = { activeSubTab = "voice" },
                            text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.PlayArrow, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Voice Tutor", fontWeight = FontWeight.Bold)
                            }}
                        )
                        Tab(
                            selected = activeSubTab == "sandbox",
                            onClick = { activeSubTab = "sandbox" },
                            text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Build, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("AI Sandbox", fontWeight = FontWeight.Bold)
                            }}
                        )
                        Tab(
                            selected = activeSubTab == "marketplace",
                            onClick = { activeSubTab = "marketplace" },
                            text = { Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Prompts Market", fontWeight = FontWeight.Bold)
                            }}
                        )
                    }
                }

                // Conditional sub views based on selected module
                when (activeSubTab) {
                    "academy" -> {
                        item {
                            SolutionsAcademyLayout(
                                viewModel = viewModel,
                                courses = courses,
                                onSelectCourse = { viewModel.selectCourseForSimulation(it) }
                            )
                        }
                    }
                    "voice" -> {
                        item {
                            VoiceTutorLayout(viewModel = viewModel)
                        }
                    }
                    "sandbox" -> {
                        item {
                            SandboxLayout(viewModel = viewModel)
                        }
                    }
                    "marketplace" -> {
                        item {
                            PromptMarketplaceLayout(viewModel = viewModel)
                        }
                    }
                }
            }
        } else {
            // Course Detail Simulation Laboratory
            CourseSimulationDetail(
                viewModel = viewModel,
                course = selectedCourse!!
            )
        }
    }
}

/**
 * 1. SOLUTIONS ACADEMY SUB SECTION
 */
@Composable
fun SolutionsAcademyLayout(
    viewModel: SwarajViewModel,
    courses: List<TrainingCourse>,
    onSelectCourse: (TrainingCourse) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }

    val categories = listOf("All", "Agri-AI & CleanTech", "Vernacular AI Edu", "Rural Health AI", "Swachh Bharat CleanTech", "FinTech Swaraj")

    val filteredCourses = courses.filter { course ->
        val matchesSearch = course.title.contains(searchQuery, ignoreCase = true) ||
                course.indianProblemState.contains(searchQuery, ignoreCase = true)
        val matchesCat = selectedCategory == "All" || course.category == selectedCategory
        matchesSearch && matchesCat
    }

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        // Search
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            modifier = Modifier
                .fillMaxWidth()
                .testTag("search_solutions_input"),
            placeholder = { Text("Search 1000+ AI Swaraj Solutions...") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Search") },
            trailingIcon = {
                if (searchQuery.isNotEmpty()) {
                    IconButton(onClick = { searchQuery = "" }) {
                        Icon(Icons.Default.Clear, contentDescription = "Clear")
                    }
                }
            },
            singleLine = true,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = MaterialTheme.colorScheme.primary,
                unfocusedBorderColor = MaterialTheme.colorScheme.outline
            )
        )

        // Filters scroll
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            items(categories) { cat ->
                val isSelected = selectedCategory == cat
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedCategory = cat },
                    label = { Text(cat) },
                    modifier = Modifier.testTag("category_pill_${cat.replace(" ", "_")}"),
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = MaterialTheme.colorScheme.primary,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                    )
                )
            }
        }

        // Stats Box
        Card(
            colors = CardDefaults.cardColors(
                containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.4f)
            ),
            shape = RoundedCornerShape(20.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = "Trainee Info",
                    modifier = Modifier.size(36.dp),
                    tint = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(16.dp))
                Column {
                    Text(
                        text = "Interactive Simulation Sandbox",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer
                    )
                    Text(
                        text = "Vetted, high-fidelity regional cases applied by rural tech innovators. Select a lab below to earn Swaraj credits.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        if (filteredCourses.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 40.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        Icons.Default.Info,
                        contentDescription = "Not found",
                        modifier = Modifier.size(48.dp),
                        tint = MaterialTheme.colorScheme.outline
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        "No solutions matched filter constraints",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        } else {
            filteredCourses.forEach { course ->
                SolutionItemCard(
                    course = course,
                    onStartTraining = { onSelectCourse(course) }
                )
                Spacer(modifier = Modifier.height(12.dp))
            }
        }
    }
}

/**
 * 2. VOICE AI TUTOR LAYOUT
 */
@Composable
fun VoiceTutorLayout(viewModel: SwarajViewModel) {
    val voiceMsgs by viewModel.voiceMessages.collectAsStateWithLifecycle()
    val isLoading by viewModel.isVoiceTutorLoading.collectAsStateWithLifecycle()

    var userTextTemp by remember { mutableStateOf("") }
    var mockAudioWaveState by remember { mutableStateOf(false) }

    val coroutineScope = rememberCoroutineScope()

    // Sound wave simulation loop when loading response or simulating play
    LaunchedEffect(isLoading, mockAudioWaveState) {
        if (isLoading || mockAudioWaveState) {
            while (true) {
                delay(300)
                // tick to draw random wave animation
            }
        }
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder(),
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            // Tutor header info
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(RoundedCornerShape(5.dp))
                            .background(Color(0xFF2E7D32))
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        "MITRA VOICE AI TUTOR",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                        fontWeight = FontWeight.Bold
                    )
                }
                IconButton(
                    onClick = {
                        mockAudioWaveState = !mockAudioWaveState
                    }
                ) {
                    Icon(
                        imageVector = if (mockAudioWaveState) Icons.Default.Close else Icons.Default.PlayArrow,
                        contentDescription = "Simulate Voice Feed",
                        tint = if (mockAudioWaveState) Color.Red else MaterialTheme.colorScheme.primary
                    )
                }
            }

            Text(
                text = "Speaks Hindi, English, Tamil, Marathi & conversational dialect tools",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.outline,
                modifier = Modifier.padding(bottom = 12.dp)
            )

            // Animated Visual Waveform heights
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp)
                    .background(
                        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.2f),
                        RoundedCornerShape(12.dp)
                    )
                    .padding(horizontal = 16.dp)
            ) {
                val amplitudePoints = if (isLoading) {
                    listOf(18, 28, 42, 35, 20, 28, 45, 12, 36, 24, 40, 15)
                } else if (mockAudioWaveState) {
                    listOf(20, 15, 35, 40, 25, 42, 30, 24, 38, 12, 28, 10)
                } else {
                    listOf(4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4)
                }

                Text(
                    text = if (isLoading) "TUTOR THINKING" else if (mockAudioWaveState) "VOICE PLAYING" else "IDLE TUTOR MICROPHONE",
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(end = 12.dp)
                )

                amplitudePoints.forEach { heightVal ->
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 2.dp)
                            .width(4.dp)
                            .height(heightVal.dp)
                            .clip(RoundedCornerShape(2.dp))
                            .background(MaterialTheme.colorScheme.primary)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Suggestions Quick-Click row
            Text("Suggestions for Quick Tuning:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            Spacer(modifier = Modifier.height(6.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val suggestions = listOf("Explain Prompting", "How Bhashini works", "What is RAG?")
                suggestions.forEach { sug ->
                    Box(
                        modifier = Modifier
                            .border(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                            .clickable {
                                userTextTemp = sug
                            }
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(sug, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Message Scroll (simulate chat)
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .heightIn(max = 220.dp)
                    .background(
                        MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f),
                        RoundedCornerShape(16.dp)
                    )
                    .padding(12.dp)
            ) {
                LazyColumn(modifier = Modifier.fillMaxWidth()) {
                    items(voiceMsgs) { (sender, text) ->
                        val isTutor = sender == "Tutor"
                        Spacer(modifier = Modifier.height(6.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = if (isTutor) Arrangement.Start else Arrangement.End
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(
                                        RoundedCornerShape(
                                            topStart = 12.dp,
                                            topEnd = 12.dp,
                                            bottomStart = if (isTutor) 0.dp else 12.dp,
                                            bottomEnd = if (isTutor) 12.dp else 0.dp
                                        )
                                    )
                                    .background(
                                        if (isTutor) MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.7f)
                                        else MaterialTheme.colorScheme.primary
                                    )
                                    .padding(12.dp)
                                    .fillMaxWidth(0.85f)
                            ) {
                                Column {
                                    Text(
                                        text = if (isTutor) "🎙️ Mitra AI Tutor" else "👤 Amit Sharma",
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.labelSmall,
                                        color = if (isTutor) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onPrimary
                                    )
                                    Text(
                                        text = text,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (isTutor) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onPrimary
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Input Row
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                OutlinedTextField(
                    value = userTextTemp,
                    onValueChange = { userTextTemp = it },
                    placeholder = { Text("Ask your voice lessons tutor...") },
                    modifier = Modifier.weight(1f),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Send),
                    keyboardActions = KeyboardActions(onSend = {
                        if (userTextTemp.isNotEmpty()) {
                            viewModel.sendVoiceTutorMessage(userTextTemp)
                            userTextTemp = ""
                        }
                    })
                )
                Spacer(modifier = Modifier.width(8.dp))
                IconButton(
                    onClick = {
                        if (userTextTemp.isNotEmpty()) {
                            viewModel.sendVoiceTutorMessage(userTextTemp)
                            userTextTemp = ""
                        }
                    },
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.primary)
                ) {
                    Icon(
                        imageVector = Icons.AutoMirrored.Filled.Send,
                        contentDescription = "Send Message",
                        tint = MaterialTheme.colorScheme.onPrimary
                    )
                }
            }
        }
    }
}

/**
 * 3. AI SANDBOX PROMPT PLAYGROUND
 */
@Composable
fun SandboxLayout(viewModel: SwarajViewModel) {
    var rawDraftInput by remember { mutableStateOf("") }
    var optimizationStrategy by remember { mutableStateOf("Swaraj Localizer") }

    val sandboxResult by viewModel.sandboxPromptResult.collectAsStateWithLifecycle()
    val isSandboxLoading by viewModel.isSandboxLoading.collectAsStateWithLifecycle()

    val strategies = listOf("Swaraj Localizer", "MSME Optimizer", "Tamil Solar Guide", "Voice Drip Dialect")

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder(),
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp)
    ) {
        Column(modifier = Modifier.padding(20.dp)) {
            Text(
                "AI SANDBOX STUDIO",
                style = MaterialTheme.typography.labelMedium,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
            Text(
                "Optimize & Test Prompts on Gemini",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onSurface
            )
            Spacer(modifier = Modifier.height(12.dp))

            // Strategy tabs
            Text("Select Engineering Strategy Option:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
            Spacer(modifier = Modifier.height(6.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(strategies) { strat ->
                    FilterChip(
                        selected = optimizationStrategy == strat,
                        onClick = { optimizationStrategy = strat },
                        label = { Text(strat) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedTextField(
                value = rawDraftInput,
                onValueChange = { rawDraftInput = it },
                label = { Text("Draft Prompt / Automation Logic Details") },
                placeholder = { Text("E.g., Write a system that gives warning triggers when a water pump runs dry across Tamil Nadu districts in the local language.") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(110.dp),
                maxLines = 4,
                singleLine = false
            )

            Spacer(modifier = Modifier.height(12.dp))

            Button(
                onClick = {
                    viewModel.optimizeSandboxPrompt(rawDraftInput, optimizationStrategy)
                },
                modifier = Modifier.fillMaxWidth(),
                enabled = rawDraftInput.isNotEmpty() && !isSandboxLoading
            ) {
                if (isSandboxLoading) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp), color = MaterialTheme.colorScheme.onPrimary)
                } else {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Build, contentDescription = null)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Optimize with Gemini (Earn +10 points)", fontWeight = FontWeight.Bold)
                    }
                }
            }

            if (sandboxResult != null) {
                Spacer(modifier = Modifier.height(16.dp))
                HorizontalDivider()
                Spacer(modifier = Modifier.height(12.dp))

                Text("OPTIMIZED ARCHITECT EMBEDDING:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Spacer(modifier = Modifier.height(6.dp))
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                        .padding(12.dp)
                ) {
                    Column {
                        Text(
                            text = sandboxResult ?: "",
                            style = MaterialTheme.typography.bodySmall,
                            fontFamily = FontFamily.Monospace,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Star, contentDescription = "Token Star", tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Token Estimate: 342 tokens. Swarj balance audited.", fontSize = 10.sp, color = MaterialTheme.colorScheme.outline)
                        }
                    }
                }
            }
        }
    }
}

/**
 * 4. PROMPT MARKETPLACE TAB
 */
@Composable
fun PromptMarketplaceLayout(viewModel: SwarajViewModel) {
    var isFormExpanded by remember { mutableStateOf(false) }

    var pTitle by remember { mutableStateOf("") }
    var pSector by remember { mutableStateOf("Agriculture") }
    var pContent by remember { mutableStateOf("") }

    // Hardcoded starting list of prompting items (can expand locally)
    var activePromptsList by remember {
        mutableStateOf(
            listOf(
                PromptCardModel("Tamil Microgrid Solar Scheduler", "Agriculture", "Optimize high draw drip batteries. System input covers Coimbatore cloud metrics from sensor models.", 42),
                PromptCardModel("Magahi Vernacular Speech trans-synth", "Education", "Inject regional farming stories into Bihar textbooks. High fidelity speech cues.", 58),
                PromptCardModel("Lakhpati Didi dairy credibility score", "Fintech", "Process socio-economic trade vectors bypassing credit bureaus.", 39)
            )
        )
    }

    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Mitra Prompt Marketplace", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Button(
                onClick = { isFormExpanded = !isFormExpanded },
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.secondary)
            ) {
                Text(if (isFormExpanded) "Close Form" else "Publish Prompt (+20 pts)")
            }
        }

        AnimatedVisibility(visible = isFormExpanded) {
            Card(
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Text("Publish Custom Prompt Configuration", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.titleMedium)

                    OutlinedTextField(
                        value = pTitle,
                        onValueChange = { pTitle = it },
                        label = { Text("Prompt Title") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = pSector,
                        onValueChange = { pSector = it },
                        label = { Text("Category / Agriculture / Vernacular Dialect") },
                        modifier = Modifier.fillMaxWidth()
                    )

                    OutlinedTextField(
                        value = pContent,
                        onValueChange = { pContent = it },
                        label = { Text("System Instruction Script") },
                        modifier = Modifier.fillMaxWidth(),
                        maxLines = 3
                    )

                    Button(
                        onClick = {
                            if (pTitle.isNotEmpty() && pContent.isNotEmpty()) {
                                val newList = activePromptsList.toMutableList()
                                newList.add(0, PromptCardModel(pTitle, pSector, pContent, 0))
                                activePromptsList = newList
                                viewModel.publishCustomPromptToMarket(pTitle, pContent, pSector)
                                pTitle = ""
                                pContent = ""
                                isFormExpanded = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Share to MitraOS Network & Collect Points")
                    }
                }
            }
        }

        activePromptsList.forEachIndexed { index, prompt ->
            Card(
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(prompt.sector, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimaryContainer, fontWeight = FontWeight.Bold)
                        }
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            IconButton(
                                onClick = {
                                    val updated = activePromptsList.toMutableList()
                                    updated[index] = prompt.copy(upvotes = prompt.upvotes + 1)
                                    activePromptsList = updated
                                }
                            ) {
                                Icon(Icons.Default.ThumbUp, contentDescription = "Upvote", tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(16.dp))
                            }
                            Text("${prompt.upvotes} UPVOTES", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(prompt.title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.onSurface)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        prompt.content,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

data class PromptCardModel(
    val title: String,
    val sector: String,
    val content: String,
    val upvotes: Int
)

/**
 * 5. SEEDED LABORATORY COURSE SIMULATION DETAILS PANEL
 */
@Composable
fun CourseSimulationDetail(
    viewModel: SwarajViewModel,
    course: TrainingCourse
) {
    val simulationIdea by viewModel.simulationUserIdea.collectAsStateWithLifecycle()
    val quizSelected by viewModel.quizSelectedOption.collectAsStateWithLifecycle()
    val quizAnswered by viewModel.isQuizAnswered.collectAsStateWithLifecycle()
    val quizCorrect by viewModel.isQuizAnswerCorrect.collectAsStateWithLifecycle()
    val feedback by viewModel.simulationFeedback.collectAsStateWithLifecycle()
    val isEvaluating by viewModel.isSimulationLoading.collectAsStateWithLifecycle()

    var notesText by remember(course.id) { mutableStateOf(course.userNotes ?: "") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Back navigation header block
        item {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                IconButton(
                    onClick = { viewModel.selectedCourse.value = null },
                    modifier = Modifier.testTag("back_to_explore_button")
                ) {
                    Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Back to Hub Directory",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }
        }

        // Details content specs
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = course.category,
                            style = MaterialTheme.typography.labelSmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "Reward: ${course.earnedReward} Swaraj Points",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = course.title,
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.ExtraBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "THE BHARAT CRISIS:",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFC62828)
                    )
                    Text(
                        text = course.indianProblemState,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "GOOGLE CLOUD AI APIS TARGETS:",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF2E7D32)
                    )
                    Text(
                        text = course.googleAiTechStack,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }

        // Phase 1 MCQ
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Check, contentDescription = "Quiz Phase", tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Phase 1: Solutions Validation",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = course.quizQuestion,
                        style = MaterialTheme.typography.bodyMedium,
                        fontWeight = FontWeight.SemiBold,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    // Option A
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable(enabled = !quizAnswered) {
                                viewModel.quizSelectedOption.value = "A"
                            }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = quizSelected == "A",
                            onClick = { viewModel.quizSelectedOption.value = "A" },
                            enabled = !quizAnswered,
                            modifier = Modifier.testTag("quiz_option_a")
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(course.quizOptionA, style = MaterialTheme.typography.bodyMedium)
                    }

                    // Option B
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable(enabled = !quizAnswered) {
                                viewModel.quizSelectedOption.value = "B"
                            }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = quizSelected == "B",
                            onClick = { viewModel.quizSelectedOption.value = "B" },
                            enabled = !quizAnswered,
                            modifier = Modifier.testTag("quiz_option_b")
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(course.quizOptionB, style = MaterialTheme.typography.bodyMedium)
                    }

                    // Option C
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(8.dp))
                            .clickable(enabled = !quizAnswered) {
                                viewModel.quizSelectedOption.value = "C"
                            }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        RadioButton(
                            selected = quizSelected == "C",
                            onClick = { viewModel.quizSelectedOption.value = "C" },
                            enabled = !quizAnswered,
                            modifier = Modifier.testTag("quiz_option_c")
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(course.quizOptionC, style = MaterialTheme.typography.bodyMedium)
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    if (!quizAnswered) {
                        Button(
                            onClick = { viewModel.submitQuizAnswer() },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .testTag("submit_quiz_button"),
                            enabled = quizSelected.isNotEmpty()
                        ) {
                            Text("Submit Solutions Quiz Validation", fontWeight = FontWeight.Bold)
                        }
                    } else {
                        if (quizCorrect) {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(Color(0xFFE8F5E9))
                                    .padding(12.dp)
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Default.Check, contentDescription = "Correct", tint = Color(0xFF2E7D32))
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        "Correct! Swaraj ledger signed. Verified Badge created in AI Wallet (+${course.earnedReward} pts reward)",
                                        color = Color(0xFF2E7D32),
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.bodySmall
                                    )
                                }
                            }
                        } else {
                            Column {
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clip(RoundedCornerShape(8.dp))
                                        .background(Color(0xFFFFEBEE))
                                        .padding(12.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Default.Warning, contentDescription = "Incorrect", tint = Color(0xFFC62828))
                                        Spacer(modifier = Modifier.width(8.dp))
                                        Text(
                                            "Incorrect option Selected. Revise the AI Brief and re-run your study.",
                                            color = Color(0xFFC62828),
                                            fontWeight = FontWeight.Bold,
                                            style = MaterialTheme.typography.bodySmall
                                        )
                                    }
                                }
                                Spacer(modifier = Modifier.height(8.dp))
                                Button(
                                    onClick = { viewModel.isQuizAnswered.value = false },
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text("Re-try solutions MCQ")
                                }
                            }
                        }
                    }
                }
            }
        }

        // Phase 2 Critique Proposal
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Face, contentDescription = "Dean Critique Phase", tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Phase 2: Custom Architecture Critique",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        "Adapt the core system template pattern to your local town or dialect. Review by active Google AI dean:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = simulationIdea,
                        onValueChange = { viewModel.simulationUserIdea.value = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(110.dp)
                            .testTag("proposal_input"),
                        placeholder = { Text("E.g., Implement water warnings in Tamil using static clouds database and Marathi regional translations maps API...") },
                        maxLines = 4,
                        textStyle = MaterialTheme.typography.bodyMedium
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { viewModel.evaluateSimulation() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .testTag("trigger_dean_critic_button"),
                        enabled = simulationIdea.isNotEmpty() && !isEvaluating
                    ) {
                        if (isEvaluating) {
                            CircularProgressIndicator(modifier = Modifier.size(24.dp), color = MaterialTheme.colorScheme.onSecondary)
                        } else {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send")
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Request Live Dean Critique (Gemini)", fontWeight = FontWeight.Bold)
                            }
                        }
                    }

                    AnimatedVisibility(visible = feedback != null) {
                        Column(modifier = Modifier.padding(top = 12.dp)) {
                            HorizontalDivider()
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "MITRA NETWORK EXPERT DEAN REVIEW:",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.primary,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = feedback ?: "",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(top = 4.dp)
                            )
                        }
                    }
                }
            }
        }

        // Phase 3 Journal
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                shape = RoundedCornerShape(20.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Edit, contentDescription = "Local journal", tint = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Phase 3: Secure Local Implementor Journal",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                    }
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Store regional variables, system parameters, dairy vectors, or solar configuration variables in local SQLite Room database cache.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedTextField(
                        value = notesText,
                        onValueChange = { notesText = it },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(85.dp)
                            .testTag("notes_input"),
                        placeholder = { Text("Compile journal guidelines here...") },
                        maxLines = 3
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    Button(
                        onClick = { viewModel.saveUserCourseNotes(notesText) },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("save_notes_button"),
                        colors = ButtonDefaults.outlinedButtonColors()
                    ) {
                        Text("Commit Diary State to SQLite")
                    }
                }
            }
        }
    }
}

@Composable
fun SolutionItemCard(
    course: TrainingCourse,
    onStartTraining: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onStartTraining() }
            .testTag("course_card_${course.id}"),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        border = CardDefaults.outlinedCardBorder()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(6.dp))
                        .background(MaterialTheme.colorScheme.primaryContainer)
                        .padding(horizontal = 8.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = course.category,
                        style = MaterialTheme.typography.labelSmall,
                        color = MaterialTheme.colorScheme.onPrimaryContainer,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "★ +${course.earnedReward} pts",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = course.title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.ExtraBold
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = course.indianProblemState,
                style = MaterialTheme.typography.bodySmall,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(modifier = Modifier.height(12.dp))
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.End,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "Start Sandbox Solutions Case",
                    style = MaterialTheme.typography.labelMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
                Spacer(modifier = Modifier.width(4.dp))
                Icon(
                    imageVector = Icons.Default.PlayArrow,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
