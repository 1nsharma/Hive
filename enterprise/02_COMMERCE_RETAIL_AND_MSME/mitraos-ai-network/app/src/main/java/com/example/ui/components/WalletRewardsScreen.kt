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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.example.ui.viewmodel.SwarajViewModel
import com.example.ui.viewmodel.VoluntaryContribution

@Composable
fun WalletRewardsScreen(
    viewModel: SwarajViewModel,
    modifier: Modifier = Modifier
) {
    val email by viewModel.userEmail.collectAsStateWithLifecycle()
    val name by viewModel.userName.collectAsStateWithLifecycle()
    val wallet by viewModel.userWallet.collectAsStateWithLifecycle()
    val certs by viewModel.certifications.collectAsStateWithLifecycle()

    var activeSubTab by remember { mutableStateOf("garmi_jung") } // "garmi_jung", "credentials"

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))

        // Title Header
        Text(
            text = "SAFE INDIA • BRAVE INDIA",
            style = MaterialTheme.typography.labelMedium,
            color = MaterialTheme.colorScheme.primary,
            fontWeight = FontWeight.Bold,
            letterSpacing = 1.5.sp
        )
        Text(
            text = "Jan Bhagidari Digital Mission",
            style = MaterialTheme.typography.headlineMedium,
            fontWeight = FontWeight.ExtraBold,
            color = MaterialTheme.colorScheme.onBackground
        )
        Text(
            text = "Become a National Climate Hero! Log civic actions, white-roof tags, or plant trees to earn SWRAJ reputation points and compete state-wise.",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.padding(top = 2.dp, bottom = 12.dp)
        )

        // Navigation Sub tabs row
        TabRow(
            selectedTabIndex = if (activeSubTab == "garmi_jung") 0 else 1,
            containerColor = Color.Transparent,
            divider = {},
            indicator = { tabPositions ->
                TabRowDefaults.SecondaryIndicator(
                    modifier = Modifier.tabIndicatorOffset(
                        tabPositions[if (activeSubTab == "garmi_jung") 0 else 1]
                    ),
                    color = MaterialTheme.colorScheme.primary
                )
            }
        ) {
            Tab(
                selected = activeSubTab == "garmi_jung",
                onClick = { activeSubTab = "garmi_jung" },
                text = { Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Warning,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = if (activeSubTab == "garmi_jung") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Garmi Se Jung Challenge", fontWeight = FontWeight.Bold)
                }}
            )
            Tab(
                selected = activeSubTab == "credentials",
                onClick = { activeSubTab = "credentials" },
                text = { Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Star,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp),
                        tint = if (activeSubTab == "credentials") MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("AI Wallet Ledger", fontWeight = FontWeight.Bold)
                }}
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        when (activeSubTab) {
            "garmi_jung" -> GarmiSeJungTab(viewModel = viewModel)
            "credentials" -> CredentialsTab(
                viewModel = viewModel,
                email = email,
                name = name,
                walletPoints = wallet?.rewardPoints ?: 250,
                claimedGrant = wallet?.claimedGrantValue ?: 0.0,
                certs = certs
            )
        }
    }
}

@Composable
fun GarmiSeJungTab(viewModel: SwarajViewModel) {
    val wallet by viewModel.userWallet.collectAsStateWithLifecycle()
    val points = wallet?.rewardPoints ?: 250
    val contributions by viewModel.userContributions.collectAsStateWithLifecycle()
    val leaderboard by viewModel.stateLeaderboard.collectAsStateWithLifecycle()
    val totalCampaignPts by viewModel.totalCampaignParticipation.collectAsStateWithLifecycle()
    val selectedState by viewModel.currentSelectedUserState.collectAsStateWithLifecycle()

    var activeActionType by remember { mutableStateOf("1 Ped Lagana") }
    val actionPointsMap = mapOf(
        "1 Ped Lagana" to 50,
        "Roof White Karna" to 100,
        "1 Litre Water Saving" to 1,
        "No Vehicle Day" to 20,
        "Cooling Center Volunteer" to 50
    )

    var detailsText by remember { mutableStateOf("") }
    var hasSimulatedSelfie by remember { mutableStateOf(false) }

    // Tier badge calculation based on SWRAJ points
    val (badgeTier, badgeColor) = when {
        points < 150 -> "Bronze Climate Hero" to Color(0xFFCD7F32)
        points < 350 -> "Silver Climate Hero" to Color(0xFF7E8B92)
        points < 600 -> "Gold Climate Hero" to Color(0xFFFFB300)
        else -> "Platinum Climate Hero" to Color(0xFF673AB7)
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 85.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Aadhaar-style verified ID Card
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = BorderStroke(1.5.dp, badgeColor),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("climate_hero_badge")
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(
                            Brush.linearGradient(
                                colors = listOf(
                                    badgeColor.copy(alpha = 0.12f),
                                    Color.Green.copy(alpha = 0.04f)
                                )
                            )
                        )
                        .padding(20.dp)
                ) {
                    Column {
                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                "NATIONAL CLIMATE HERO STATUS",
                                fontWeight = FontWeight.Black,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.primary,
                                fontFamily = FontFamily.Monospace,
                                letterSpacing = 1.sp
                            )
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Verified Seal",
                                tint = badgeColor,
                                modifier = Modifier.size(24.dp)
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(
                                modifier = Modifier
                                    .size(52.dp)
                                    .clip(RoundedCornerShape(26.dp))
                                    .background(badgeColor),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    text = if (viewModel.userName.value.isNotEmpty()) viewModel.userName.value.take(1).uppercase() else "A",
                                    fontSize = 22.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.White
                                )
                            }
                            Spacer(modifier = Modifier.width(16.dp))
                            Column {
                                Text(
                                    text = viewModel.userName.value,
                                    fontWeight = FontWeight.ExtraBold,
                                    style = MaterialTheme.typography.titleMedium
                                )
                                Text(
                                    text = "Aadhaar Identity verified securely • Active Node",
                                    style = MaterialTheme.typography.bodySmall,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF2E7D32)
                                )
                                Text(
                                    text = "Citizen ID: IN-HERO-999-76",
                                    style = MaterialTheme.typography.labelSmall,
                                    fontFamily = FontFamily.Monospace,
                                    color = MaterialTheme.colorScheme.outline
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))
                        HorizontalDivider(thickness = 0.5.dp, color = MaterialTheme.colorScheme.outline.copy(alpha = 0.3f))
                        Spacer(modifier = Modifier.height(12.dp))

                        Row(
                            horizontalArrangement = Arrangement.SpaceBetween,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Column {
                                Text("MITRA REP SCORE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Text("$points SWRAJ Pts", fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.primary)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("BADGE TIER STATUS", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Box(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(6.dp))
                                        .background(badgeColor)
                                        .padding(horizontal = 8.dp, vertical = 2.dp)
                                ) {
                                    Text(badgeTier, style = MaterialTheme.typography.labelSmall, color = Color.White, fontWeight = FontWeight.Black)
                                }
                            }
                        }
                    }
                }
            }
        }

        // Live Campaign Dispatch tracker
        item {
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer.copy(alpha = 0.4f)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(RoundedCornerShape(5.dp))
                            .background(Color.Red)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "LIVE CAMPAIGN: NATIONAL VOLUNTARY CONTRIBUTIONS AT $totalCampaignPts PARTICIPANTS",
                        style = MaterialTheme.typography.labelMedium,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier.weight(1f)
                    )
                }
            }
        }

        // Action Input Form
        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Text(
                        "SUBMIT CLIMATE MITIGATION PROOF",
                        fontWeight = FontWeight.Bold,
                        style = MaterialTheme.typography.titleMedium,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        "Pledge action voluntarily to trigger state multipliers, earn verified reputation score points and complete secure local database validation.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )

                    // Challenge Selector
                    Text("Select Completed Mitigation Type:", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        items(actionPointsMap.keys.toList()) { actName ->
                            val isSel = activeActionType == actName
                            FilterChip(
                                selected = isSel,
                                onClick = { activeActionType = actName },
                                label = { Text(actName) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = MaterialTheme.colorScheme.primary,
                                    selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                                )
                            )
                        }
                    }

                    // Selected State compete row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Competing State:", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.Bold)

                        var showStatesDropdown by remember { mutableStateOf(false) }
                        Box {
                            Button(
                                onClick = { showStatesDropdown = true },
                                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.surfaceVariant, contentColor = MaterialTheme.colorScheme.onSurfaceVariant)
                            ) {
                                Text("$selectedState ▼", fontWeight = FontWeight.Bold)
                            }
                            DropdownMenu(
                                expanded = showStatesDropdown,
                                onDismissRequest = { showStatesDropdown = false }
                            ) {
                                leaderboard.keys.forEach { stateName ->
                                    DropdownMenuItem(
                                        text = { Text(stateName) },
                                        onClick = {
                                            viewModel.currentSelectedUserState.value = stateName
                                            showStatesDropdown = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    OutlinedTextField(
                        value = detailsText,
                        onValueChange = { detailsText = it },
                        modifier = Modifier.fillMaxWidth(),
                        label = { Text("Details (Sapling tag, White-layer sq ft, or Location)") },
                        placeholder = { Text("E.g., Sapling ID: DLH-TR990. Dwarka Park Area.") },
                        singleLine = true
                    )

                    // Selfie Cam simulator
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(MaterialTheme.colorScheme.surfaceVariant)
                            .clickable {
                                hasSimulatedSelfie = !hasSimulatedSelfie
                            }
                            .padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.PlayArrow, contentDescription = "Cam proof", tint = MaterialTheme.colorScheme.primary)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text("Aadhaar Geotag Photo", fontWeight = FontWeight.Bold, style = MaterialTheme.typography.bodyMedium)
                                Text(if (hasSimulatedSelfie) "Selfie proof coordinates linked!" else "Tap to simulation verify camera action", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                            }
                        }
                        if (hasSimulatedSelfie) {
                            Icon(Icons.Default.Check, contentDescription = "OK", tint = Color(0xFF2E7D32))
                        }
                    }

                    val rewardPoints = actionPointsMap[activeActionType] ?: 10
                    Button(
                        onClick = {
                            viewModel.addGarmiContribution(activeActionType, detailsText, rewardPoints)
                            detailsText = ""
                            hasSimulatedSelfie = false
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("submit_garmi_action_button"),
                        enabled = detailsText.isNotEmpty()
                    ) {
                        Text("Verify and Mint SWRAJ reputation (+$rewardPoints Points)", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // State vs State board
        item {
            Text(
                "🔥 BHARAT STATE VS STATE INDICES",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary
            )
        }

        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        "Jan Bhagidari Heat Mitigate Tally",
                        fontWeight = FontWeight.ExtraBold,
                        style = MaterialTheme.typography.titleMedium
                    )
                    Text(
                        "Top state triggers a mock ₹100 Crore regional green cooling allocation from national CSR partnerships.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.outline,
                        modifier = Modifier.padding(bottom = 12.dp)
                    )

                    leaderboard.entries.sortedByDescending { it.value }.forEachIndexed { index, entry ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 6.dp)
                        ) {
                            Text(
                                "Rank #${index + 1}",
                                fontWeight = FontWeight.Bold,
                                fontSize = 12.sp,
                                modifier = Modifier.width(64.dp),
                                color = if (index < 3) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.outline
                            )
                            Text(
                                entry.key,
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium,
                                modifier = Modifier.weight(1f)
                            )
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(6.dp))
                                    .background(MaterialTheme.colorScheme.primaryContainer)
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    "${entry.value} Items",
                                    fontWeight = FontWeight.ExtraBold,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }
                    }
                }
            }
        }

        // Sponsorship locked Level Meters
        item {
            Text(
                "⚠️ PARTNERSHIP & DIRECT LIQUIDITY METERS",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary
            )
        }

        item {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.Lock, contentDescription = "Locked", tint = Color.Red, modifier = Modifier.size(24.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                "Status: Free Liquidities is currently Locked",
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.bodyMedium,
                                color = Color.Red
                            )
                            Text(
                                "Corporate CSR funds and brand rewards will unlock dynamically as participation scales national milestones.",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.outline
                            )
                        }
                    }

                    HorizontalDivider(thickness = 0.5.dp)

                    // volats
                    MilestoneSponsorCard(
                        title = "Voltas Heatwave AC Care",
                        sub = "Every verified white-lime rooftop logs a Voltas inspection service discount.",
                        progress = 0.21f,
                        progressStr = "21.9% Progress (Target: 10 Lakh Actions)",
                        reward = "Free AC Service"
                    )

                    // jio
                    MilestoneSponsorCard(
                        title = "Jio / Airtel Mobile Data Rewards",
                        sub = "Completing climate tasks unlocks free 1GB regional mobile coupon data.",
                        progress = 0.12f,
                        progressStr = "12.4% Progress (Target: 30 Lakh Actions)",
                        reward = "Free 1GB Coupon"
                    )

                    // tata
                    MilestoneSponsorCard(
                        title = "Tata / ITC CSR Ration Program",
                        sub = "Each verified sapling logged triggers 1 KG free regional wheat bounds for BPL families.",
                        progress = 0.05f,
                        progressStr = "5.5% Progress (Target: 50 Lakh Actions)",
                        reward = "1 KG Grain Ticket"
                    )

                    // maruti
                    MilestoneSponsorCard(
                        title = "Maruti Suzuki Grand EV Prize",
                        sub = "The top individual Climate Hero on national leadership gains 1 free Electric EV car.",
                        progress = 0.01f,
                        progressStr = "0.1% Progress (Target: 1 Crore Actions)",
                        reward = "Free EV Car"
                    )

                    // amitabh
                    MilestoneSponsorCard(
                        title = "Meet PM Modi & Ambassadors",
                        sub = "Includes priority meeting invitation with Voluntary Ambassadors in New Delhi.",
                        progress = 0.07f,
                        progressStr = "7.5% Progress (Target: 10,000 Points)",
                        reward = "Ambassador Dinner"
                    )
                }
            }
        }

        // Historial Action lists
        item {
            Text(
                "📝 SECURE BLOCK CHAIN LEDGER PROGRESS",
                fontWeight = FontWeight.Bold,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary
            )
        }

        if (contributions.isEmpty()) {
            item {
                Text(
                    "No climate contributions logged yet. Choose an action above to start competing for your state and earn points!",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.outline,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    textAlign = TextAlign.Center
                )
            }
        } else {
            items(contributions) { item ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                item.type,
                                fontWeight = FontWeight.Black,
                                style = MaterialTheme.typography.bodyMedium
                            )
                            Text(
                                "+${item.pointsEarned} SWRAJ",
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary,
                                style = MaterialTheme.typography.labelMedium
                            )
                        }
                        Text(
                            item.details,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                            Text("SATUS: SECURE SIGNED LEDGER", fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = Color(0xFF2E7D32), fontWeight = FontWeight.Bold)
                            Text(item.timestamp, fontSize = 9.sp, color = MaterialTheme.colorScheme.outline)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MilestoneSponsorCard(
    title: String,
    sub: String,
    progress: Float,
    progressStr: String,
    reward: String
) {
    Column(modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontWeight = FontWeight.ExtraBold, style = MaterialTheme.typography.bodyMedium)
                Text(sub, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(6.dp))
                    .border(1.dp, Color.Red, RoundedCornerShape(6.dp))
                    .padding(horizontal = 8.dp, vertical = 4.dp)
            ) {
                Text(reward, fontSize = 10.sp, color = Color.Red, fontWeight = FontWeight.Bold)
            }
        }
        Spacer(modifier = Modifier.height(6.dp))
        LinearProgressIndicator(
            progress = { progress },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = Color.Red.copy(alpha = 0.5f),
            trackColor = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.05f)
        )
        Spacer(modifier = Modifier.height(3.dp))
        Text(progressStr, fontSize = 10.sp, color = MaterialTheme.colorScheme.outline, fontWeight = FontWeight.Bold)
    }
}

@Composable
fun CredentialsTab(
    viewModel: SwarajViewModel,
    email: String,
    name: String,
    walletPoints: Int,
    claimedGrant: Double,
    certs: List<com.example.data.database.UserCertification>
) {
    var showAccountSwitcher by remember { mutableStateOf(false) }
    var inputEmail by remember { mutableStateOf(email) }
    var inputName by remember { mutableStateOf(name) }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(bottom = 85.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Account / Profile identity Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                border = CardDefaults.outlinedCardBorder(),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("profile_identity_card")
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.AccountBox,
                                contentDescription = "User info",
                                modifier = Modifier.size(40.dp),
                                tint = MaterialTheme.colorScheme.primary
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = name,
                                    fontWeight = FontWeight.ExtraBold,
                                    style = MaterialTheme.typography.titleMedium,
                                    color = MaterialTheme.colorScheme.onSurface
                                )
                                Text(
                                    text = email,
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant
                                )
                            }
                        }

                        IconButton(
                            onClick = { showAccountSwitcher = !showAccountSwitcher },
                            modifier = Modifier.testTag("toggle_identity_button")
                        ) {
                            Icon(
                                imageVector = if (showAccountSwitcher) Icons.Default.Close else Icons.Default.AccountCircle,
                                contentDescription = "Switch Account",
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }

                    if (viewModel.isFounder()) {
                        Spacer(modifier = Modifier.height(8.dp))
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(4.dp))
                                .background(MaterialTheme.colorScheme.primaryContainer)
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                "FOUNDER & PRIMARY DEVELOPER ACCESS ENABLED",
                                style = MaterialTheme.typography.labelSmall,
                                color = MaterialTheme.colorScheme.onPrimaryContainer,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    AnimatedVisibility(visible = showAccountSwitcher) {
                        Column(modifier = Modifier.padding(top = 16.dp)) {
                            HorizontalDivider()
                            Spacer(modifier = Modifier.height(12.dp))
                            Text(
                                "Google Workspace SSO Integration",
                                fontWeight = FontWeight.Bold,
                                style = MaterialTheme.typography.labelMedium,
                                color = MaterialTheme.colorScheme.primary
                            )
                            Text(
                                "We request secure read-only verification scopes to issues certificates and coordinate regional grant pools:",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                modifier = Modifier.padding(vertical = 4.dp)
                            )
                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedTextField(
                                value = inputName,
                                onValueChange = { inputName = it },
                                label = { Text("Display Name") },
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("switch_name_input")
                            )
                            Spacer(modifier = Modifier.height(8.dp))

                            OutlinedTextField(
                                value = inputEmail,
                                onValueChange = { inputEmail = it },
                                label = { Text("Google Email Account") },
                                singleLine = true,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("switch_email_input")
                            )
                            Spacer(modifier = Modifier.height(12.dp))

                            Button(
                                onClick = {
                                    viewModel.login(inputEmail, inputName)
                                    showAccountSwitcher = false
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("confirm_switch_button"),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = MaterialTheme.colorScheme.secondary
                                )
                            ) {
                                Text("Link New Google Account Context Securely")
                            }
                        }
                    }
                }
            }
        }

        // Token Balance Gradient Presentation Card
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(28.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .testTag("token_balance_card"),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp)
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        text = "MITRAOS SECURED LEDGER BALANCE",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                        letterSpacing = 1.sp
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.Star,
                            contentDescription = "Token Star",
                            tint = MaterialTheme.colorScheme.tertiary,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "$walletPoints",
                            fontSize = 42.sp,
                            fontWeight = FontWeight.Black,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                        Text(
                            text = " SWRAJ",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onPrimaryContainer
                        )
                    }

                    Text(
                        text = "1 SWRAJ ≈ ₹10 Virtuality Development Allotment",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                        modifier = Modifier.padding(vertical = 4.dp)
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    LinearProgressIndicator(
                        progress = { 0.74f },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(8.dp)
                            .clip(RoundedCornerShape(4.dp)),
                        color = MaterialTheme.colorScheme.primary,
                        trackColor = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.15f)
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "74% to Payout",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    val virtualGrantEstimate = walletPoints * 10.0

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("Total Grant Credit", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f))
                            Text("₹$virtualGrantEstimate", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onPrimaryContainer)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("Liquidated Cash", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f))
                            Text("₹$claimedGrant", fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32))
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = { viewModel.redeemPointsForGrant() },
                        enabled = walletPoints >= 50,
                        modifier = Modifier
                            .fillMaxWidth()
                            .testTag("redeem_grant_button"),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = MaterialTheme.colorScheme.primary,
                            contentColor = MaterialTheme.colorScheme.onPrimary
                        )
                    ) {
                        Text("Convert 50 Points to Local ₹500 DeFi Payout", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Credentials Section
        item {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Star, contentDescription = "Certs Icon", tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "Google AI Swaraj Verified Certificates",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onBackground
                )
            }
        }

        if (certs.isEmpty()) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Info,
                            contentDescription = "No certificates",
                            modifier = Modifier.size(48.dp),
                            tint = MaterialTheme.colorScheme.outline
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = "No Verified Badges Issued",
                            fontWeight = FontWeight.Bold,
                            style = MaterialTheme.typography.titleMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Answer technical check quizzes inside the Learn Hub to earn verified certificates stamped directly on SQLite ledger.",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }
                }
            }
        } else {
            items(certs) { cert ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("certificate_card_${cert.id}"),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    ),
                    border = CardDefaults.outlinedCardBorder()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    imageVector = Icons.Default.Star,
                                    contentDescription = "Seal icon",
                                    tint = MaterialTheme.colorScheme.tertiary,
                                    modifier = Modifier.size(28.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "SECURED LEDGER PROTOCOL",
                                    fontSize = 10.sp,
                                    color = MaterialTheme.colorScheme.primary,
                                    fontWeight = FontWeight.ExtraBold,
                                    fontFamily = FontFamily.Monospace
                                )
                            }
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(Color(0xFFE8F5E9))
                                    .padding(horizontal = 8.dp, vertical = 2.dp)
                            ) {
                                Text(
                                    text = "VERIFIED",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = Color(0xFF2E7D32),
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Text(
                            text = "Google AI Solutions Architect",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.ExtraBold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Verified Module: ${cert.title}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Bold
                        )

                        Spacer(modifier = Modifier.height(8.dp))
                        HorizontalDivider(thickness = 0.5.dp)
                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Column {
                                Text("RECIPIENT", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Text(cert.earnerEmail, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text("ISSUE DATE", style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.outline)
                                Text(cert.dateEarned, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Bold)
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .padding(8.dp)
                        ) {
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Text("LICENSE CODE", fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.outline)
                                Text(cert.badgeCode, fontSize = 9.sp, fontFamily = FontFamily.Monospace, fontWeight = FontWeight.Bold)
                            }
                            Spacer(modifier = Modifier.height(2.dp))
                            Row(horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                                Text("SECURE BLOCK HASH", fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.outline)
                                Text(cert.txHash, fontSize = 9.sp, fontFamily = FontFamily.Monospace, color = MaterialTheme.colorScheme.primary)
                            }
                        }
                    }
                }
            }
        }
    }
}
