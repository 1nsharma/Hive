package com.example.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.data.database.CustomWorld
import com.example.ui.viewmodel.SwarajViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.json.JSONObject

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomWorldScreen(
    viewModel: SwarajViewModel,
    modifier: Modifier = Modifier
) {
    val creatorInd by viewModel.creatorIndustry.collectAsStateWithLifecycle()
    val creatorPrmpt by viewModel.creatorPrompt.collectAsStateWithLifecycle()
    val isBlueprintLoading by viewModel.isBlueprintLoading.collectAsStateWithLifecycle()
    val blueprintResult by viewModel.generatedBlueprint.collectAsStateWithLifecycle()
    val myWorldsAll by viewModel.customWorlds.collectAsStateWithLifecycle()

    var activeViewBlueprint by remember { mutableStateOf<CustomWorld?>(null) }
    var topSubTab by remember { mutableStateOf("architect") } // "architect", "creator_saas"

    val parsedSelected = remember(activeViewBlueprint) {
        activeViewBlueprint?.let { parseBlueprintJson(it.fullArchitectureJson) }
    }

    val industries = listOf(
        "Agriculture & Soil Care",
        "Rural Fintech & Banking",
        "Vernacular Primary Education",
        "AYUSH Diagnostics",
        "Smart Municipal Waste Grid"
    )

    Column(modifier = modifier.fillMaxSize()) {
        if (activeViewBlueprint == null) {
            // Sticky Tab Selection Row
            TabRow(
                selectedTabIndex = if (topSubTab == "architect") 0 else 1,
                containerColor = MaterialTheme.colorScheme.surfaceColorAtElevation(1.dp),
                divider = {},
                indicator = { tabPositions ->
                    TabRowDefaults.SecondaryIndicator(
                        modifier = Modifier.tabIndicatorOffset(
                            tabPositions[if (topSubTab == "architect") 0 else 1]
                        ),
                        color = MaterialTheme.colorScheme.primary
                    )
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Tab(
                    selected = topSubTab == "architect",
                    onClick = { topSubTab = "architect" },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Build, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("AI Node Architect", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    },
                    modifier = Modifier.testTag("tab_node_architect")
                )
                Tab(
                    selected = topSubTab == "creator_saas",
                    onClick = { topSubTab = "creator_saas" },
                    text = {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Hum-AI-n SaaS Desk", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        }
                    },
                    modifier = Modifier.testTag("tab_creator_saas")
                )
            }
        }

        if (topSubTab == "architect" || activeViewBlueprint != null) {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp),
                contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if (activeViewBlueprint == null) {
                    item {
                        Text(
                            text = "MITRAOS DYNAMIC STUDIO",
                            style = MaterialTheme.typography.labelMedium,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.5.sp
                        )
                        Text(
                            text = "AI Builder Studio & India Problem Hub",
                            style = MaterialTheme.typography.headlineMedium,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onBackground
                        )
                        Text(
                            text = "Build functional AI Agent nodes, chatbot parameters, workflow automation pipelines, or resolve major grassroots problems facing India securely without coding.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 4.dp, bottom = 8.dp)
                        )
                    }

                    // Input Form Card
                    item {
                        Card(
                            modifier = Modifier.fillMaxWidth(),
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                            border = CardDefaults.outlinedCardBorder()
                        ) {
                            Column(modifier = Modifier.padding(16.dp)) {
                                Text(
                                    text = "1. Select Regional Industry Context",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                LazyRow(
                                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    items(industries) { ind ->
                                        val selected = creatorInd == ind
                                        FilterChip(
                                            selected = selected,
                                            onClick = { viewModel.creatorIndustry.value = ind },
                                            label = { Text(ind) },
                                            modifier = Modifier.testTag("industry_chip_${ind.take(12)}")
                                        )
                                    }
                                }

                                Spacer(modifier = Modifier.height(16.dp))

                                Text(
                                    text = "2. Describe Local Crisis or Opportunity",
                                    fontWeight = FontWeight.Bold,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Spacer(modifier = Modifier.height(8.dp))

                                OutlinedTextField(
                                    value = creatorPrmpt,
                                    onValueChange = { viewModel.creatorPrompt.value = it },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(120.dp)
                                        .testTag("custom_problem_input"),
                                    placeholder = { Text("E.g., Prevent high tomato pest infestation in rural Satara using camera sensors and voice Alerts in Marathi language...") },
                                    maxLines = 5,
                                    singleLine = false
                                )

                                Spacer(modifier = Modifier.height(16.dp))

                                Button(
                                    onClick = { viewModel.generateWorldBlueprint() },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(50.dp)
                                        .testTag("generate_world_button"),
                                    colors = ButtonDefaults.buttonColors(
                                        containerColor = MaterialTheme.colorScheme.primary,
                                        contentColor = MaterialTheme.colorScheme.onPrimary
                                    ),
                                    enabled = creatorPrmpt.isNotEmpty() && !isBlueprintLoading
                                ) {
                                    if (isBlueprintLoading) {
                                        CircularProgressIndicator(
                                            modifier = Modifier.size(24.dp),
                                            color = MaterialTheme.colorScheme.onPrimary
                                        )
                                    } else {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            horizontalArrangement = Arrangement.Center
                                        ) {
                                            Icon(Icons.Default.Build, contentDescription = "Spark Icon")
                                            Spacer(modifier = Modifier.width(8.dp))
                                            Text("Deploy AI Node Blueprint (+100 SWRAJ)", fontWeight = FontWeight.Bold)
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Fresh generation display
                    item {
                        AnimatedVisibility(visible = blueprintResult != null) {
                            blueprintResult?.let { rawJson ->
                                val parsed = remember(rawJson) { parseBlueprintJson(rawJson) }
                                BlueprintDisplayCard(
                                    techArch = parsed.techArch,
                                    apis = parsed.apis,
                                    milestones = parsed.milestones,
                                    impact = parsed.impact,
                                    summary = parsed.summary,
                                    header = "Current AI Model Output"
                                )
                            }
                        }
                    }

                    // History Header
                    item {
                        HorizontalDivider()
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Info, contentDescription = "History", tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "History: Grassroots AI Worlds (${myWorldsAll.size})",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                        }
                    }

                    // Empty state helper for history
                    if (myWorldsAll.isEmpty() && blueprintResult == null) {
                        item {
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 32.dp),
                                contentAlignment = Alignment.Center
                            ) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Icon(
                                        Icons.Default.Info,
                                        contentDescription = "Nothing generated",
                                        modifier = Modifier.size(48.dp),
                                        tint = MaterialTheme.colorScheme.outline
                                    )
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        "No Custom Worlds generated yet",
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onSurfaceVariant
                                    )
                                    Text(
                                        "Use the form above to trigger your first Gemini simulation.",
                                        style = MaterialTheme.typography.bodySmall,
                                        color = MaterialTheme.colorScheme.outline
                                    )
                                }
                            }
                        }
                    } else {
                        items(myWorldsAll) { world ->
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable { activeViewBlueprint = world }
                                    .testTag("history_world_card_${world.id}"),
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = world.selectedIndustry,
                                            style = MaterialTheme.typography.labelSmall,
                                            color = MaterialTheme.colorScheme.primary,
                                            fontWeight = FontWeight.Bold
                                        )
                                        Text(
                                            text = "Task: ${world.problemPrompt}",
                                            style = MaterialTheme.typography.titleMedium,
                                            fontWeight = FontWeight.Bold,
                                            maxLines = 1,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            text = "Generated on Swaraj Ledger: ${java.text.SimpleDateFormat("dd MMM, HH:mm", java.util.Locale.getDefault()).format(java.util.Date(world.timestamp))}",
                                            style = MaterialTheme.typography.bodySmall,
                                            color = MaterialTheme.colorScheme.outline
                                        )
                                    }
                                    IconButton(onClick = { activeViewBlueprint = world }) {
                                        Icon(Icons.Default.PlayArrow, contentDescription = "View", tint = MaterialTheme.colorScheme.primary)
                                    }
                                }
                            }
                        }
                    }
                } else {
                    // View detailed specific generated historical blueprint
                    val world = activeViewBlueprint!!
                    val parsed = parsedSelected ?: parseBlueprintJson(world.fullArchitectureJson)

                    item {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            IconButton(
                                onClick = { activeViewBlueprint = null },
                                modifier = Modifier.testTag("back_to_creator_button")
                            ) {
                                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Back to Generator",
                                style = MaterialTheme.typography.titleMedium,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.onBackground
                            )
                        }
                    }

                    item {
                        BlueprintDisplayCard(
                            techArch = parsed.techArch,
                            apis = parsed.apis,
                            milestones = parsed.milestones,
                            impact = parsed.impact,
                            summary = parsed.summary,
                            header = "${world.selectedIndustry} Blueprint"
                        )
                    }
                }
            }
        } else {
            // Hum-AI-n Creator SaaS & Compliance Studio!
            HumAiNCreatorSuite(
                viewModel = viewModel,
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp)
            )
        }
    }
}

/**
 * VISUALLY PRESTIGIOUS AND DYNAMIC LAYER
 * Hum-AI-n Creator SaaS & India Compliance Suite Simulator
 */
@Composable
fun HumAiNCreatorSuite(
    viewModel: SwarajViewModel,
    modifier: Modifier = Modifier
) {
    val coroutineScope = rememberCoroutineScope()
    
    // Sliders Workstates
    var humanRatio by remember { mutableStateOf(65f) }
    var aiRatio by remember { mutableStateOf(75f) }
    
    // Projections states
    var audSize by remember { mutableStateOf(80_000f) }
    var arpuVal by remember { mutableStateOf(29f) } // monthly USD equivalent or INR per user
    var churnRate by remember { mutableStateOf(6.2f) }
    
    // India Tax Slider
    var annualRevenueLakhs by remember { mutableStateOf(24f) } // 2 Lakhs to 75 Lakhs range for Sec 44ADA

    // Interactive Checklist items click verification states
    var gstApplied by remember { mutableStateOf(false) }
    var lutFiled by remember { mutableStateOf(false) }
    var femaFircTracked by remember { mutableStateOf(false) }
    
    // Webhook simulation states
    var isSimulatingWebhook by remember { mutableStateOf(false) }
    val webhookLogsList = remember { mutableStateListOf<String>() }
    
    // Checklist Roadmap maps (indices 0..3 for Phase 1, 4..7 for Phase 2, 8..11 for Phase 3)
    val roadmapCompletedMask = remember { mutableStateMapOf<Int, Boolean>() }
    val claimedPhases = remember { mutableStateMapOf<Int, Boolean>() }

    // Computations
    val audienceTrustFactor = remember(humanRatio, aiRatio) {
        (humanRatio * 0.9f + (100f - aiRatio) * 0.1f).coerceIn(0f, 100f)
    }
    
    val calculatedConversionRate = remember(humanRatio, aiRatio) {
        ((humanRatio * 0.045f + 0.2f) * (1.0f - aiRatio / 300f)).coerceIn(0.1f, 10f)
    }
    
    val activeCustomers = remember(audSize, calculatedConversionRate) {
        (audSize * (calculatedConversionRate / 100f)).toInt()
    }
    
    val estimatedMonthlyRevenue = remember(activeCustomers, arpuVal) {
        activeCustomers * arpuVal
    }
    
    val ltvValue = remember(arpuVal, churnRate) {
        if (churnRate > 0) {
            (arpuVal * (1.0f - 0.12f)) / (churnRate / 100f) // Assuming standard Stripe 12% total cost allocation
        } else {
            0f
        }
    }

    LazyColumn(
        modifier = modifier,
        contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Welcome Header Gradient Card
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("creator_suite_hero"),
                border = BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.22f),
                                    MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.08f)
                                )
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = MaterialTheme.shapes.extraSmall,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(end = 8.dp)
                            ) {
                                Text(
                                    "HUM-AI-N MODEL v1.0",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = MaterialTheme.colorScheme.onPrimary,
                                    modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                                )
                            }
                            Text(
                                "Live Sandbox Builder",
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.secondary,
                                fontWeight = FontWeight.SemiBold
                            )
                        }
                        Text(
                            "Human Authenticity + AI Native Scalability",
                            style = MaterialTheme.typography.titleLarge,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            "Validate cross-border audience economics, de-risk platform dependencies, simulate payment gateways webhooks directly, and claim tax rebates using presumptive Section 44ADA.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }

        // Section 1: Trust & Scale Balance Tool
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            "1. Synergistic Multiplier Simulator",
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Icon(Icons.Default.CheckCircle, "Synergy status", tint = MaterialTheme.colorScheme.tertiary)
                    }
                    Text(
                        "Drag sliders to adjust human-authentic storytelling vs automated distribution. Watch conversion rates and trust variables change on-the-fly.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    // Slider Human ratio
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Human Authenticity Ratio (Storytelling)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("${humanRatio.toInt()}%", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                        }
                        Slider(
                            value = humanRatio,
                            onValueChange = { humanRatio = it },
                            valueRange = 10f..100f,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.primary)
                        )
                        Text("Struggle, experience sharing, localized language regional parables & custom behind-the-scenes logs.", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    // Slider AI ratio
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("AI Automation & Scalability Option", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("${aiRatio.toInt()}%", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.secondary)
                        }
                        Slider(
                            value = aiRatio,
                            onValueChange = { aiRatio = it },
                            valueRange = 10f..100f,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.secondary)
                        )
                        Text("Personal agents managing profile relationships 24/7 and automating localized translations.", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))

                    // Core outputs grid
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.2f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("Audience Trust Index", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Text("${"%.1f".format(audienceTrustFactor)}%", fontWeight = FontWeight.Black, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.primary)
                            }
                        }

                        Card(
                            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer.copy(alpha = 0.2f)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("Conversion Rate (p)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Text("${"%.2f".format(calculatedConversionRate)}%", fontWeight = FontWeight.Black, style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.secondary)
                            }
                        }
                    }

                    // Synergy Feedback Box
                    val balanceOpinion = when {
                        humanRatio > 70f && aiRatio > 65f -> "🚀 SOLO EMPIRE: Optimum balance! Human narrative retains intense loyalty while AI automates redundant workload."
                        humanRatio > 70f && aiRatio <= 40f -> "🕰️ COGNITIVE EXTRACTION POTENTIAL: High narrative authority but zero automation bounds. You are facing severe burnout. Outsource catalog templates & pipeline agents!"
                        humanRatio <= 40f && aiRatio > 70f -> "🤖 AI SLOP HAZARD: Robotic content, audience ignores you. Drop generic transcripts; overlay regional voice notes & real works of proof."
                        else -> "📉 HYBRID INCUBATION: Active design stage. Strive to maintain human authenticity above 60% for trusted monetizable niches."
                    }

                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f))
                            .padding(12.dp)
                    ) {
                        Text(
                            text = balanceOpinion,
                            style = MaterialTheme.typography.bodySmall,
                            fontWeight = FontWeight.SemiBold,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }

        // Section 2: Venture Financial Projections Panel
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "2. Strategic Financial Model",
                        fontWeight = FontWeight.ExtraBold,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        "Optimize unit economics variables. The slider inputs calculate predicted active users, gross monthly margins, and Lifetime Value vs Customer Acquisition Cost.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    // Slider followers
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Total Connected Audience Size", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("${audSize.toInt() / 1000}K Followers", fontWeight = FontWeight.ExtraBold)
                        }
                        Slider(
                            value = audSize,
                            onValueChange = { audSize = it },
                            valueRange = 10000f..1000000f,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.onSurface)
                        )
                    }

                    // Slider Price (ARPU)
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Average Revenue Per User (monthly)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("${arpuVal.toInt()} USD (${(arpuVal * 82.5f).toInt()} INR)", fontWeight = FontWeight.ExtraBold)
                        }
                        Slider(
                            value = arpuVal,
                            onValueChange = { arpuVal = it },
                            valueRange = 5f..200f,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.onSurface)
                        )
                    }

                    // Slider Churn Rule
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Monthly Member Churn Rate (c)", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("${"%.1f".format(churnRate)}%", fontWeight = FontWeight.ExtraBold, color = Color(0xFFC62828))
                        }
                        Slider(
                            value = churnRate,
                            onValueChange = { churnRate = it },
                            valueRange = 1f..15f,
                            colors = SliderDefaults.colors(thumbColor = Color(0xFFC62828))
                        )
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))

                    // Outputs Grid
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            // Active buyers
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Active Customer Base", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                    Text("$activeCustomers members", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                                }
                            }

                            // Monthly revenue
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.tertiaryContainer.copy(alpha = 0.2f)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("Gross Monthly Runrate", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                    Text("${"%,.1f".format(estimatedMonthlyRevenue)} USD", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.tertiary)
                                }
                            }
                        }

                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            // LTV calculo
                            Card(
                                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.4f)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("LTV per customer (12% tax)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                    Text("${"%,.1f".format(ltvValue)} USD", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                                }
                            }

                            // Health indicator
                            val isLtvHealthy = ltvValue > 150f // standard high-value threshold assuming CAC is $50
                            Card(
                                colors = CardDefaults.cardColors(containerColor = if (isLtvHealthy) Color(0xFFE8F5E9) else Color(0xFFFFEBEE)),
                                modifier = Modifier.weight(1f)
                            ) {
                                Column(modifier = Modifier.padding(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("LTV:CAC Check (CAC=$50)", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                    Text(
                                        text = if (isLtvHealthy) "HEALTHY (3x+ CAC)" else "RISKY LTV (Low ARPU)",
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.bodySmall,
                                        color = if (isLtvHealthy) Color(0xFF2E7D32) else Color(0xFFC62828)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 3: Swaraj Compliance & India Tax Desk (Presumptive Section 44ADA)
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            "3. Swaraj Tax & Compliance Office",
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Icon(Icons.Default.Star, "Tax Star", tint = Color(0xFFFFB300))
                    }
                    Text(
                        "Indian tax laws are creator-friendly! Under Section 44ADA (presumptive scheme for tech professionals & creators with revenue < ₹75L), only 50% of your gross income is considered taxable. Drag the slider to simulate tax savings:",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Simulated Annual Gross Earnings", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodySmall)
                            Text("₹${annualRevenueLakhs.toInt()} Lakhs", fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                        }
                        Slider(
                            value = annualRevenueLakhs,
                            onValueChange = { annualRevenueLakhs = it },
                            valueRange = 2f..75f,
                            colors = SliderDefaults.colors(thumbColor = MaterialTheme.colorScheme.primary)
                        )
                    }

                    // Compare table
                    Card(
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceColorAtElevation(1.dp)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            Text("TAXABLE ACCOUNTING SUMMARY COMPARISON:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                            
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Standard Accounting Net Profit (estimated)", fontSize = 11.sp, color = MaterialTheme.colorScheme.outline)
                                Text("₹${"%.1f".format(annualRevenueLakhs * 0.82f)} L (82%)", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Section 44ADA Presumptive Taxable Net", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                                Text("₹${"%.1f".format(annualRevenueLakhs * 0.5f)} L (50%)", fontSize = 11.sp, fontWeight = FontWeight.ExtraBold, color = MaterialTheme.colorScheme.primary)
                            }

                            HorizontalDivider()

                            val taxableDiff = (annualRevenueLakhs * 0.82f) - (annualRevenueLakhs * 0.5f)
                            // Assuming simple 30% flat tax bracket for high earners
                            val estimatedTaxSaved = taxableDiff * 0.312f

                            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                                Text("Estimated Tax Saved under Sec 44ADA", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32))
                                Text("₹${"%.2f".format(estimatedTaxSaved)} Lakhs!", fontSize = 12.sp, fontWeight = FontWeight.ExtraBold, color = Color(0xFF2E7D32))
                            }
                        }
                    }

                    HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp))

                    // Indian Compliance Action Buttons
                    Text("REGULATORY ENFORCEMENT PROTOCOLS:", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.outline)
                    
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        // GST button
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                            Button(
                                onClick = { gstApplied = true },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (gstApplied) Color(0xFFE8F5E9) else MaterialTheme.colorScheme.secondary,
                                    contentColor = if (gstApplied) Color(0xFF2E7D32) else MaterialTheme.colorScheme.onSecondary
                                ),
                                modifier = Modifier.weight(1f).height(44.dp)
                            ) {
                                Icon(Icons.Default.CheckCircle, null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(if (gstApplied) "GST REGISTERED (CODE 16021)" else "Register GST under Code 16021", fontSize = 11.sp)
                            }
                        }
                        if (gstApplied) {
                            Text("✓ GSTIN Profile Activated: 09AMTPS5412K2ZN. Industry Category: Automated IT Consultancy & Content Licensing. Standard zero taxation applies for foreign transactions.", style = MaterialTheme.typography.labelSmall, color = Color(0xFF2E7D32), modifier = Modifier.padding(start = 4.dp))
                        }

                        // LUT Button
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                            Button(
                                onClick = { lutFiled = true },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (lutFiled) Color(0xFFE8F5E9) else MaterialTheme.colorScheme.secondary,
                                    contentColor = if (lutFiled) Color(0xFF2E7D32) else MaterialTheme.colorScheme.onSecondary
                                ),
                                modifier = Modifier.weight(1f).height(44.dp),
                                enabled = gstApplied
                            ) {
                                Icon(Icons.Default.Check, null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(if (lutFiled) "LUT ON BLOCKCHAIN GENERATED" else "File LUT Zero-GST Export", fontSize = 11.sp)
                            }
                        }
                        if (lutFiled) {
                            Text("✓ Letter of Undertaking (LUT) reference LUT/DEL/2026/99976 logged securely. Your foreign revenue streams bypass 18% IGST withholding legally.", style = MaterialTheme.typography.labelSmall, color = Color(0xFF2E7D32), modifier = Modifier.padding(start = 4.dp))
                        }

                        // FEMA card check
                        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                            Button(
                                onClick = { femaFircTracked = true },
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = if (femaFircTracked) Color(0xFFE8F5E9) else MaterialTheme.colorScheme.secondary,
                                    contentColor = if (femaFircTracked) Color(0xFF2E7D32) else MaterialTheme.colorScheme.onSecondary
                                ),
                                modifier = Modifier.weight(1f).height(44.dp),
                                enabled = lutFiled
                            ) {
                                Icon(Icons.Default.Info, null, modifier = Modifier.size(16.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(if (femaFircTracked) "FEMA COLLATERAL READY" else "Verify FEMA incoming FIRC code", fontSize = 11.sp)
                            }
                        }
                        if (femaFircTracked) {
                            Text("✓ Foreign Inward Remittance Certificate (FIRC) is auto-tracked. Foreign payments are auto-verified as lawful inward remittances on Swaraj database logs.", style = MaterialTheme.typography.labelSmall, color = Color(0xFF2E7D32), modifier = Modifier.padding(start = 4.dp))
                        }
                    }
                }
            }
        }

        // Section 4: Webhook Simulation Terminal
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            "4. Interactive Webhook Ledger pipeline",
                            fontWeight = FontWeight.ExtraBold,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.primary
                        )
                        Icon(Icons.Default.Star, "Webhook Icon", tint = MaterialTheme.colorScheme.primary)
                    }
                    Text(
                        "Test Meta's Graph API incoming webhook events. Simulating a virtual Reels Gift ($1.00 USD) triggers the ledger integration, verifies compliance, and adds +20 SWRAJ points directly into your database wallet!",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    Button(
                        onClick = {
                            coroutineScope.launch {
                                isSimulatingWebhook = true
                                webhookLogsList.clear()
                                webhookLogsList.add("> Listening on Verification Endpoint: https://ais-pre-3s2zk6w4.run.app/api/webhooks")
                                delay(600)
                                webhookLogsList.add("> [WEBHOOK MATCH] Incoming meta transaction webhook handshake payload...")
                                delay(700)
                                webhookLogsList.add("> [Meta API Event] Verified Reel ID: IG-COI-998 (Coimbatore grid promo)")
                                delay(600)
                                webhookLogsList.add("> [STRIPE INSIGHTS] Settled Stripe Connect split payout (+₹82.50 to vault)")
                                delay(800)
                                webhookLogsList.add("> [COMPLIANCE LEDGER] Logged GST LUT exemption tracking under code 16021")
                                delay(700)
                                webhookLogsList.add("> [SWRAJ CREDIT] Successfully matching secure peer node, credited +20 points!")
                                
                                // Credit points to the real Swaraj Wallet in the SQLite Database!
                                viewModel.addGarmiContribution(
                                    type = "SaaS Webhook Sim",
                                    points = 20,
                                    details = "Verified incoming Meta Reel Gift event payload with automatic zero-GST LUT compliance accounting."
                                )
                                isSimulatingWebhook = false
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.tertiary),
                        enabled = !isSimulatingWebhook
                    ) {
                        if (isSimulatingWebhook) {
                            CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Color.White)
                        } else {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Notifications, null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Trigger Test Reel Gift Webhook ($1.00 USD)", fontWeight = FontWeight.Black)
                            }
                        }
                    }

                    // Terminal
                    if (webhookLogsList.isNotEmpty()) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(Color.Black)
                                .padding(12.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                                webhookLogsList.forEach { log ->
                                    Text(
                                        text = log,
                                        style = MaterialTheme.typography.labelSmall,
                                        fontFamily = FontFamily.Monospace,
                                        color = if (log.contains("SWRAJ")) Color.Green else if (log.contains("Error")) Color.Red else Color(0xFFFFEB3B)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 5: Dynamic 90-Day Execution Roadmap Checklist
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder()
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text(
                        "5. Strategic 90-Day Operational Roadmap",
                        fontWeight = FontWeight.ExtraBold,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        "Execute your rollout plan. Toggle milestones as completed. When all items of a phase are verified, claim your +50 SWRAJ reputation bounty!",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    // Progress indicators
                    val completedCount = roadmapCompletedMask.values.count { it }
                    val progressRatio = completedCount / 12f
                    Column {
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("Ecosystem Launch Progress", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            Text("$completedCount/12 Tasks Done", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        LinearProgressIndicator(
                            progress = { progressRatio },
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(MaterialTheme.shapes.small),
                            color = MaterialTheme.colorScheme.primary,
                            trackColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.3f)
                        )
                    }

                    // Phases Column
                    val phases = listOf(
                        Triple(1, "Phase 1: Validation (Days 1–30)", listOf(
                            "Validate Meta Graph API & Webhook endpoints",
                            "Establish 5 internal niche accounts (1k+ followers)",
                            "Develop Stripe Connect split payout backend ledger sandbox",
                            "Register GSTIN Profile + LUT exemption certificate"
                        )),
                        Triple(2, "Phase 2: Pilot (Days 31–60)", listOf(
                            "Deploy Unified Creator Hub Analytics Dashboard",
                            "Verify automated DM sequencing triggers for gifts",
                            "Onboard 10 strategic regional micro-creators on beta list",
                            "File and verify presumptive Section 44ADA claim form template"
                        )),
                        Triple(3, "Phase 3: Scale (Days 61–90)", listOf(
                            "Grow internal accounts catalog reach backings up to 10k followers",
                            "Fully integrate automated cross-border FIRC ledger triggers",
                            "Transition 50 active beta creators to monthly subscription plan",
                            "Initiate Seed Round pitches to 5 premier Angel investors"
                        ))
                    )

                    phases.forEach { phase ->
                        val phaseId = phase.first
                        val phaseTitle = phase.second
                        val tasks = phase.third
                        
                        // Check if all tasks in this phase are selected
                        val startIndex = (phaseId - 1) * 4
                        val isPhaseComplete = (startIndex until startIndex + 4).all { idx -> 
                            roadmapCompletedMask[idx] == true 
                        }
                        
                        val isClaimed = claimedPhases[phaseId] == true

                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = if (isPhaseComplete) Color(0xFFE8F5E9) else MaterialTheme.colorScheme.surfaceColorAtElevation(1.dp)
                            ),
                            border = BorderStroke(1.dp, if (isPhaseComplete) Color(0xFF81C784) else MaterialTheme.colorScheme.outline.copy(alpha = 0.12f)),
                            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)
                        ) {
                            Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                Row(
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    Text(
                                        text = phaseTitle,
                                        fontWeight = FontWeight.Bold,
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = if (isPhaseComplete) Color(0xFF1B5E20) else MaterialTheme.colorScheme.onSurface
                                    )
                                    if (isPhaseComplete) {
                                        Icon(Icons.Default.CheckCircle, "Phase Complete", tint = Color(0xFF2E7D32), modifier = Modifier.size(18.dp))
                                    }
                                }

                                tasks.forEachIndexed { relativeIdx, task ->
                                    val absIdx = startIndex + relativeIdx
                                    val isChecked = roadmapCompletedMask[absIdx] == true
                                    
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically,
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .clickable { 
                                                roadmapCompletedMask[absIdx] = !isChecked 
                                            }
                                            .padding(vertical = 4.dp)
                                    ) {
                                        Checkbox(
                                            checked = isChecked,
                                            onCheckedChange = { 
                                                roadmapCompletedMask[absIdx] = it 
                                            },
                                            colors = CheckboxDefaults.colors(
                                                checkedColor = if (isPhaseComplete) Color(0xFF2E7D32) else MaterialTheme.colorScheme.primary
                                            )
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = task,
                                            fontSize = 11.sp,
                                            color = if (isChecked) MaterialTheme.colorScheme.outline else MaterialTheme.colorScheme.onSurface,
                                            lineHeight = 14.sp
                                        )
                                    }
                                }

                                if (isPhaseComplete && !isClaimed) {
                                    Spacer(modifier = Modifier.height(4.dp))
                                    Button(
                                        onClick = {
                                            viewModel.addGarmiContribution(
                                                type = "Phase $phaseId Standard Complete",
                                                points = 50,
                                                details = "Satisfied all verified milestones for operational execution checklist: '$phaseTitle'!"
                                            )
                                            claimedPhases[phaseId] = true
                                        },
                                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                        modifier = Modifier.fillMaxWidth().height(36.dp),
                                        contentPadding = PaddingValues(0.dp)
                                    ) {
                                        Icon(Icons.Default.Star, null, modifier = Modifier.size(14.dp))
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text("Claim Phase Bounty (+50 SWRAJ Coins)", style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.Black)
                                    }
                                } else if (isClaimed) {
                                    Box(
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .background(Color(0xFFC8E6C9), shape = RoundedCornerShape(8.dp))
                                            .padding(8.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("🛡️ Bounty Verified & Ledger Audited (+50 Credits Saved)", fontSize = 10.sp, color = Color(0xFF1B5E20), fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun BlueprintDisplayCard(
    techArch: String,
    apis: String,
    milestones: String,
    impact: String,
    summary: String,
    header: String
) {
    Card(
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.2f)
        ),
        border = CardDefaults.outlinedCardBorder(),
        modifier = Modifier.fillMaxWidth().testTag("blueprint_display")
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth()
            ) {
                Icon(
                    imageVector = Icons.Default.CheckCircle,
                    contentDescription = "Success",
                    tint = Color(0xFF2E7D32)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = header.uppercase(),
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                "SYSTEM INFRASTRUCTURE ARCHITECTURE",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = techArch,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                "INTEGRATED GOOGLE SERVICES & APIS",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = apis,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                "REGIONAL SOCIAL & ECONOMIC IMPACT",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = impact,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                "IMPLEMENTATION MILESTONES",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.secondary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = milestones,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface
            )

            Spacer(modifier = Modifier.height(16.dp))
            HorizontalDivider()
            Spacer(modifier = Modifier.height(12.dp))

            Text(
                "DEAN SUMMARY AND VERIFIED OUTCOMES",
                style = MaterialTheme.typography.labelSmall,
                color = MaterialTheme.colorScheme.primary,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = summary,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

// Helper structures
data class ParsedBlueprint(
    val techArch: String,
    val apis: String,
    val milestones: String,
    val impact: String,
    val summary: String
)

fun parseBlueprintJson(rawJson: String): ParsedBlueprint {
    return try {
        val safeRaw = rawJson.trim()
        val json = JSONObject(safeRaw)
        ParsedBlueprint(
            techArch = json.optString("technical_architecture", "Google Cloud Functions + SQLite Local Store"),
            apis = json.optString("apis_used", "Gemini 3.5 Flash Model"),
            milestones = json.optString("milestones", "1. Setup prototype local tests"),
            impact = json.optString("regional_impact", "Enhances local knowledge & system scalability"),
            summary = json.optString("solution_summary", "Excellent solution outline tailored for regional challenges.")
        )
    } catch (e: Exception) {
        // Fallback for non-json responses from Gemini
        ParsedBlueprint(
            techArch = "Gemini AI Orchestrator with room persistence",
            apis = "Google Gemini 3.5 Flash, Bhashini Vernacular Translation Engine",
            milestones = "1. Pilot test locally, 2. Deploy Cloud infrastructure setup, 3. Certification Airdrop",
            impact = "Decentralized regional learning solutions for village hubs",
            summary = rawJson
        )
    }
}
