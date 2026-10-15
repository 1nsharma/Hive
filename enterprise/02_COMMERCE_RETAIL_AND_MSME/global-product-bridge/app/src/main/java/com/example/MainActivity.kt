package com.example

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccountBalance
import androidx.compose.material.icons.filled.Badge
import androidx.compose.material.icons.filled.Hub
import androidx.compose.material.icons.filled.RocketLaunch
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.sp
import com.example.ui.components.DocxPreviewDialog
import com.example.ui.components.GlobalHeader
import com.example.ui.screens.AiAdvisorSheet
import com.example.ui.screens.CapitalEngineScreen
import com.example.ui.screens.ContextEngineScreen
import com.example.ui.screens.DashboardScreen
import com.example.ui.screens.PartnerGraphScreen
import com.example.ui.screens.TrustProfileScreen
import com.example.ui.theme.GoldPrimary
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.theme.Navy800
import com.example.ui.theme.Navy900
import com.example.ui.theme.Slate200
import com.example.ui.theme.Slate400
import com.example.ui.viewmodel.GlobalBridgeViewModel
import com.example.ui.viewmodel.GlobalTab

class MainActivity : ComponentActivity() {

    private val viewModel: GlobalBridgeViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                GlobalProductBridgeApp(viewModel = viewModel)
            }
        }
    }
}

@Composable
fun GlobalProductBridgeApp(viewModel: GlobalBridgeViewModel) {
    val context = LocalContext.current
    val snackbarHostState = remember { SnackbarHostState() }

    val activeTab by viewModel.activeTab.collectAsState()
    val allProjects by viewModel.allProjects.collectAsState()
    val selectedProjectId by viewModel.selectedProjectId.collectAsState()
    val selectedProject by viewModel.selectedProject.collectAsState()
    val projectEvidence by viewModel.projectEvidence.collectAsState()
    val allPartners by viewModel.allPartners.collectAsState()
    val capitalPlan by viewModel.capitalPlan.collectAsState()
    val primaryIdentity by viewModel.primaryIdentity.collectAsState()
    val evidenceFilter by viewModel.evidenceFilter.collectAsState()
    val partnerSearchQuery by viewModel.partnerSearchQuery.collectAsState()
    val toastMessage by viewModel.toastMessage.collectAsState()

    var showAiAdvisor by remember { mutableStateOf(false) }
    var showDocxPreview by remember { mutableStateOf(false) }

    val aiState by viewModel.aiAnalysisState.collectAsState()

    LaunchedEffect(toastMessage) {
        toastMessage?.let { msg ->
            snackbarHostState.showSnackbar(msg)
            viewModel.clearToast()
        }
    }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        snackbarHost = { SnackbarHost(hostState = snackbarHostState) },
        topBar = {
            GlobalHeader(
                projects = allProjects,
                selectedProjectId = selectedProjectId,
                onSelectProject = { viewModel.selectProject(it) },
                onOpenAiAdvisor = { showAiAdvisor = true },
                onExportDocx = { viewModel.exportAndShareDocx(context) },
                onOpenDocxPreview = { showDocxPreview = true }
            )
        },
        bottomBar = {
            NavigationBar(
                containerColor = Navy900,
                contentColor = Slate200
            ) {
                NavigationBarItem(
                    selected = activeTab == GlobalTab.LAUNCH_PROJECTS,
                    onClick = { viewModel.selectTab(GlobalTab.LAUNCH_PROJECTS) },
                    icon = { Icon(Icons.Default.RocketLaunch, contentDescription = "Launch OS") },
                    label = { Text("Launch OS", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Navy900,
                        selectedTextColor = GoldPrimary,
                        indicatorColor = GoldPrimary,
                        unselectedIconColor = Slate400,
                        unselectedTextColor = Slate400
                    ),
                    modifier = Modifier.testTag("nav_tab_launch")
                )

                NavigationBarItem(
                    selected = activeTab == GlobalTab.TRUST_PROFILE,
                    onClick = { viewModel.selectTab(GlobalTab.TRUST_PROFILE) },
                    icon = { Icon(Icons.Default.Shield, contentDescription = "Trust Profile") },
                    label = { Text("Trust Profile", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Navy900,
                        selectedTextColor = GoldPrimary,
                        indicatorColor = GoldPrimary,
                        unselectedIconColor = Slate400,
                        unselectedTextColor = Slate400
                    ),
                    modifier = Modifier.testTag("nav_tab_trust")
                )

                NavigationBarItem(
                    selected = activeTab == GlobalTab.PARTNER_GRAPH,
                    onClick = { viewModel.selectTab(GlobalTab.PARTNER_GRAPH) },
                    icon = { Icon(Icons.Default.Hub, contentDescription = "Partner Graph") },
                    label = { Text("Partners", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Navy900,
                        selectedTextColor = GoldPrimary,
                        indicatorColor = GoldPrimary,
                        unselectedIconColor = Slate400,
                        unselectedTextColor = Slate400
                    ),
                    modifier = Modifier.testTag("nav_tab_partners")
                )

                NavigationBarItem(
                    selected = activeTab == GlobalTab.CAPITAL_ENGINE,
                    onClick = { viewModel.selectTab(GlobalTab.CAPITAL_ENGINE) },
                    icon = { Icon(Icons.Default.AccountBalance, contentDescription = "Capital Engine") },
                    label = { Text("Capital", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Navy900,
                        selectedTextColor = GoldPrimary,
                        indicatorColor = GoldPrimary,
                        unselectedIconColor = Slate400,
                        unselectedTextColor = Slate400
                    ),
                    modifier = Modifier.testTag("nav_tab_capital")
                )

                NavigationBarItem(
                    selected = activeTab == GlobalTab.CONTEXT_GRAPH,
                    onClick = { viewModel.selectTab(GlobalTab.CONTEXT_GRAPH) },
                    icon = { Icon(Icons.Default.Badge, contentDescription = "Identity") },
                    label = { Text("Identity", fontSize = 10.sp, fontWeight = FontWeight.Bold) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = Navy900,
                        selectedTextColor = GoldPrimary,
                        indicatorColor = GoldPrimary,
                        unselectedIconColor = Slate400,
                        unselectedTextColor = Slate400
                    ),
                    modifier = Modifier.testTag("nav_tab_identity")
                )
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (activeTab) {
                GlobalTab.LAUNCH_PROJECTS -> {
                    DashboardScreen(
                        project = selectedProject,
                        onExportDocx = { viewModel.exportAndShareDocx(context) },
                        onPreviewDocx = { showDocxPreview = true },
                        onNavigateToTrustProfile = { viewModel.selectTab(GlobalTab.TRUST_PROFILE) },
                        onNavigateToPartners = { viewModel.selectTab(GlobalTab.PARTNER_GRAPH) },
                        onNavigateToCapital = { viewModel.selectTab(GlobalTab.CAPITAL_ENGINE) },
                        onOpenAiAdvisor = { showAiAdvisor = true }
                    )
                }

                GlobalTab.TRUST_PROFILE -> {
                    TrustProfileScreen(
                        evidenceList = projectEvidence,
                        activeFilter = evidenceFilter,
                        onFilterChange = { viewModel.setEvidenceFilter(it) },
                        onToggleEvidence = { viewModel.toggleEvidenceStatus(it) },
                        onExportDocx = { viewModel.exportAndShareDocx(context) }
                    )
                }

                GlobalTab.PARTNER_GRAPH -> {
                    PartnerGraphScreen(
                        partnerList = allPartners,
                        searchQuery = partnerSearchQuery,
                        onSearchChange = { viewModel.setPartnerSearchQuery(it) }
                    )
                }

                GlobalTab.CAPITAL_ENGINE -> {
                    CapitalEngineScreen(capitalPlan = capitalPlan)
                }

                GlobalTab.CONTEXT_GRAPH -> {
                    ContextEngineScreen(identity = primaryIdentity)
                }
            }
        }
    }

    if (showDocxPreview && selectedProject != null) {
        DocxPreviewDialog(
            project = selectedProject!!,
            evidenceList = projectEvidence,
            partnerList = allPartners,
            capitalPlan = capitalPlan,
            onDismiss = { showDocxPreview = false },
            onDownloadDocx = {
                showDocxPreview = false
                viewModel.exportAndShareDocx(context)
            }
        )
    }

    if (showAiAdvisor) {
        AiAdvisorSheet(
            state = aiState,
            onAnalyze = { prod, orig, targ, cat ->
                viewModel.runGlobalizationAnalysis(prod, orig, targ, cat)
            },
            onDismiss = { showAiAdvisor = false }
        )
    }
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
    Text(text = "Global Product Bridge: $name", modifier = modifier)
}

@Preview(showBackground = true)
@Composable
fun GreetingPreview() {
    MyApplicationTheme { Greeting("Android") }
}
