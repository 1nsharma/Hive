package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Build
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.ui.components.CustomWorldScreen
import com.example.ui.components.ExploreLabScreen
import com.example.ui.components.FounderConsoleScreen
import com.example.ui.components.WalletRewardsScreen
import com.example.ui.theme.MyApplicationTheme
import com.example.ui.viewmodel.SwarajViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                SwarajAppContent()
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SwarajAppContent() {
    val viewModel: SwarajViewModel = viewModel()
    val activeTab by viewModel.currentTab.collectAsStateWithLifecycle()
    val isFounderDefault = viewModel.isFounder()

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        topBar = {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        text = "MITRAOS AI NETWORK",
                        fontWeight = FontWeight.Black,
                        letterSpacing = 2.sp,
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 20.sp
                    )
                },
                navigationIcon = {
                    IconButton(onClick = { /* info click */ }) {
                        Icon(Icons.Default.Star, contentDescription = "MitraOS Trust badge", tint = MaterialTheme.colorScheme.tertiary)
                    }
                },
                actions = {
                    if (isFounderDefault) {
                        Surface(
                            shape = MaterialTheme.shapes.small,
                            color = MaterialTheme.colorScheme.secondaryContainer,
                            modifier = Modifier.padding(end = 8.dp)
                        ) {
                            Text(
                                text = "FOUNDER",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onSecondaryContainer,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = MaterialTheme.colorScheme.background
                )
            )
        },
        bottomBar = {
            NavigationBar(
                modifier = Modifier.testTag("swaraj_bottom_nav"),
                containerColor = MaterialTheme.colorScheme.surface,
                windowInsets = NavigationBarDefaults.windowInsets
            ) {
                // Learn Hub Tab
                NavigationBarItem(
                    selected = activeTab == 0,
                    onClick = { viewModel.selectTab(0) },
                    icon = { Icon(Icons.Default.Home, contentDescription = "Learn Hub Icon") },
                    label = { Text("Learn Hub", fontSize = 11.sp) },
                    modifier = Modifier.testTag("nav_explore_tab")
                )

                // AI Studio Tab
                NavigationBarItem(
                    selected = activeTab == 1,
                    onClick = { viewModel.selectTab(1) },
                    icon = { Icon(Icons.Default.Build, contentDescription = "AI Studio Icon") },
                    label = { Text("AI Studio", fontSize = 11.sp) },
                    modifier = Modifier.testTag("nav_creator_tab")
                )

                // MitraOS Wallet Tab
                NavigationBarItem(
                    selected = activeTab == 2,
                    onClick = { viewModel.selectTab(2) },
                    icon = { Icon(Icons.Default.Star, contentDescription = "Wallet Icon") },
                    label = { Text("AI Wallet", fontSize = 11.sp) },
                    modifier = Modifier.testTag("nav_wallet_tab")
                )

                // Founder Admin Tab
                NavigationBarItem(
                    selected = activeTab == 3,
                    onClick = { viewModel.selectTab(3) },
                    icon = { Icon(Icons.Default.Settings, contentDescription = "Admin Desk Icon") },
                    label = { Text("Founder Desk", fontSize = 11.sp) },
                    modifier = Modifier.testTag("nav_admin_tab")
                )
            }
        }
    ) { innerPadding ->
        // Direct View Routing based on ViewModel Tab selection
        when (activeTab) {
            0 -> ExploreLabScreen(
                viewModel = viewModel,
                modifier = Modifier.padding(innerPadding)
            )
            1 -> CustomWorldScreen(
                viewModel = viewModel,
                modifier = Modifier.padding(innerPadding)
            )
            2 -> WalletRewardsScreen(
                viewModel = viewModel,
                modifier = Modifier.padding(innerPadding)
            )
            3 -> FounderConsoleScreen(
                viewModel = viewModel,
                modifier = Modifier.padding(innerPadding)
            )
        }
    }
}
