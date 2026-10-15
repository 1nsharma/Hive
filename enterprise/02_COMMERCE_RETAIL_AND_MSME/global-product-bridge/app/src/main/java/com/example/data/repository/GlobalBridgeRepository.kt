package com.example.data.repository

import com.example.data.local.GlobalBridgeDatabase
import com.example.data.model.CapitalPlan
import com.example.data.model.FounderIdentity
import com.example.data.model.GlobalPartner
import com.example.data.model.LaunchProject
import com.example.data.model.TrustEvidence
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class GlobalBridgeRepository(private val db: GlobalBridgeDatabase) {
    private val projectDao = db.launchProjectDao()
    private val evidenceDao = db.trustEvidenceDao()
    private val partnerDao = db.globalPartnerDao()
    private val capitalDao = db.capitalPlanDao()
    private val identityDao = db.founderIdentityDao()

    val allProjects: Flow<List<LaunchProject>> = projectDao.getAllProjects()
    val allEvidence: Flow<List<TrustEvidence>> = evidenceDao.getAllEvidence()
    val allPartners: Flow<List<GlobalPartner>> = partnerDao.getAllPartners()
    val primaryIdentity: Flow<FounderIdentity?> = identityDao.getPrimaryIdentity()

    fun getProjectById(id: String): Flow<LaunchProject?> = projectDao.getProjectById(id)
    fun getEvidenceForProject(id: String): Flow<List<TrustEvidence>> = evidenceDao.getEvidenceForProject(id)
    fun getCapitalPlanForProject(id: String): Flow<CapitalPlan?> = capitalDao.getCapitalPlan(id)

    suspend fun updateEvidenceStatus(id: String, status: String) = withContext(Dispatchers.IO) {
        evidenceDao.updateEvidenceStatus(id, status)
    }

    suspend fun insertNewProject(project: LaunchProject) = withContext(Dispatchers.IO) {
        projectDao.insertProject(project)
    }

    suspend fun initializeSeedDataIfNeeded() = withContext(Dispatchers.IO) {
        val existingProjects = projectDao.getAllProjects().firstOrNull()
        if (existingProjects.isNullOrEmpty()) {
            seedDatabase()
        }
    }

    private suspend fun seedDatabase() {
        // Flagship Project: India -> France Fragrance
        val fragranceProject = LaunchProject(
            id = "india-france-fragrance",
            title = "Mitti & Rose Attar Haute Parfumerie",
            category = "Luxury Cosmetics & Fine Fragrance",
            originCountry = "India (Kannauj)",
            targetCountry = "France (Paris / EU)",
            description = "Hydro-distilled petrichor (Mitti Attar) & Rosa damascena formulated into modern alcohol-free & fine parfum for the French niche luxury market.",
            overallReadiness = 64,
            websiteReadiness = 72,
            complianceReadiness = 61,
            supplyReadiness = 84,
            distributionReadiness = 28,
            regulatorySummary = "CPSR: In Review | PIF: 75% Compiled | CPNP: Pending RP Sign-off | Responsible Person (RP): Matched in Paris | French Labeling: Drafted",
            supplySummary = "Deg & Bhapka Hydro-distillation verified in Kannauj. Batch #001 formulated, COA & GC-MS chemical fingerprinting uploaded.",
            commercialSummary = "Target: High-end Parisian perfume connoisseurs & eco-luxury seekers. Discovery set (5x2ml) recommended. Benchmark: €140 / 50ml EDP.",
            marketGapSummary = "French market saturated with synthetic ouds; high unmet desire for authentic rain petrichor & transparent natural distillation heritage.",
            targetCustomer = "Selective Parisian niche perfume consumers, boutique retail curators in Le Marais, Saint-Germain-des-Prés.",
            priceBenchmark = "€145 for 50ml Flacon | €35 for 5-Vial Discovery Set (Free Shipping + €35 voucher against full bottle).",
            batchCode = "KNJ-2026-B001",
            isFlagship = true
        )

        // Alternate Corridor 1: India -> US SaaS
        val saasProject = LaunchProject(
            id = "india-us-saas",
            title = "CloudTelemetry Zero-Latency Engine",
            category = "Enterprise Infrastructure & DevTools",
            originCountry = "India (Bengaluru)",
            targetCountry = "United States (San Francisco / NYC)",
            description = "High-throughput eBPF distributed telemetry platform engineered by Indian systems architects for Fortune 500 US engineering teams.",
            overallReadiness = 78,
            websiteReadiness = 90,
            complianceReadiness = 85,
            supplyReadiness = 95,
            distributionReadiness = 42,
            regulatorySummary = "SOC2 Type II: Certified | HIPAA BAA: Ready | Delaware C-Corp: Incorporated (Stripe Atlas) | US Patent: Provisional Filed",
            supplySummary = "AWS/GCP multi-region nodes deployed. 99.995% SLA sustained across 400M daily test RPCs.",
            commercialSummary = "ACV: $36,000 / year tier. Self-serve usage tier with 14-day free trial. US design partner feedback positive.",
            marketGapSummary = "Incumbent solutions charge 4x bandwidth egress; customers demanding sub-millisecond overhead.",
            targetCustomer = "VP of Infrastructure, Principal SREs at mid-market US FinTech and AI companies.",
            priceBenchmark = "$2,500/mo base + $0.08 per GB processed.",
            batchCode = "REL-v2.4.0-US",
            isFlagship = false
        )

        // Alternate Corridor 2: India -> Germany Precision Manufacturing
        val mfgProject = LaunchProject(
            id = "india-germany-mfg",
            title = "Aerospace Grade CNC Titanium Forgings",
            category = "Industrial High-Precision Engineering",
            originCountry = "India (Pune / Coimbatore)",
            targetCountry = "Germany (Stuttgart / Bavaria)",
            description = "5-axis precision machined components and titanium investment castings meeting European DIN aerospace tolerances.",
            overallReadiness = 59,
            websiteReadiness = 60,
            complianceReadiness = 70,
            supplyReadiness = 82,
            distributionReadiness = 25,
            regulatorySummary = "EN 9100 / AS9100D: Audit Scheduled | REACH/RoHS: Compliant | CE Declaration: Validated | Customs EORI: Active",
            supplySummary = "ISO 9001 certified clean-room CNC facility. CMM inspection certificates for first 50 pilot test coupons.",
            commercialSummary = "Contract pricing benchmark: €420 / unit vs German local machine shop €780. Tooling lead time 4 weeks.",
            marketGapSummary = "German Mittelstand facing acute domestic CNC labor shortages; searching for trusted tier-2 Indian suppliers.",
            targetCustomer = "Head of Procurement, Tier-1 Automotive & Drone Propulsion manufacturers in Baden-Württemberg.",
            priceBenchmark = "Volume price €380/unit at MOQ 250 pcs, FOB Mumbai.",
            batchCode = "TITAN-CNC-004",
            isFlagship = false
        )

        projectDao.insertProjects(listOf(fragranceProject, saasProject, mfgProject))

        // 13 Global Trust Evidence Vectors for India -> France Fragrance
        val trustEvidenceList = listOf(
            TrustEvidence(
                id = "ev-01",
                projectId = "india-france-fragrance",
                category = "FOUNDER_VERIFICATION",
                title = "Founder Identity & Artisan Pedigree",
                detail = "National Identity KYC verified. 3rd-generation heritage distillers guild membership in Kannauj. Government of India Export Excellence citation.",
                issuerOrEvidence = "Aadhaar e-KYC & Kannauj Perfumers Association Guild Registry #KPA-2021",
                status = "VERIFIED",
                dateVerified = "Aug 14, 2026",
                evidenceHash = "SHA256:7e91...verified-gov-in"
            ),
            TrustEvidence(
                id = "ev-02",
                projectId = "india-france-fragrance",
                category = "COMPANY_VERIFICATION",
                title = "Legal Entity & Export Licensure",
                detail = "Private Limited entity active in good standing. Ministry of Commerce Import Export Code (IEC) and GST zero-rated export ledger active.",
                issuerOrEvidence = "MCA Corporate Affairs (CIN: U24249UP2022PTC) & DGFT IEC #0516098231",
                status = "VERIFIED",
                dateVerified = "Sep 02, 2026",
                evidenceHash = "SHA256:4b22...verified-dgft"
            ),
            TrustEvidence(
                id = "ev-03",
                projectId = "india-france-fragrance",
                category = "PRODUCT_VERIFICATION",
                title = "Kannauj Origin & Botanical Authenticity",
                detail = "Geographical Indication (GI) tagged Kannauj Perfume status verified. 100% pure steam & hydro-distillation without chemical petrochemical extenders.",
                issuerOrEvidence = "GI Registry Office India (GI Certificate #GI-UP-42) & Fragrance & Flavour Development Centre (FFDC)",
                status = "VERIFIED",
                dateVerified = "Jul 19, 2026",
                evidenceHash = "SHA256:3a19...ffdc-tested"
            ),
            TrustEvidence(
                id = "ev-04",
                projectId = "india-france-fragrance",
                category = "IP_OWNERSHIP",
                title = "International Trademark & Formula Protection",
                detail = "Madrid Protocol International Trademark application for Class 3 (Perfumery) registered in EU and India. Proprietary enfleurage protocol registered.",
                issuerOrEvidence = "WIPO Madrid System & EUIPO Application #018944120",
                status = "VERIFIED",
                dateVerified = "Jun 11, 2026",
                evidenceHash = "SHA256:9c12...wipo-madrid"
            ),
            TrustEvidence(
                id = "ev-05",
                projectId = "india-france-fragrance",
                category = "MANUFACTURING_EVIDENCE",
                title = "GMP & ISO 22716 Cleanliness Audit",
                detail = "Good Manufacturing Practice (GMP) for Cosmetics audited. Batch blending rooms humidity-controlled, sanitized filtration equipment.",
                issuerOrEvidence = "Bureau Veritas Cosmetic GMP Certification (ISO 22716:2007)",
                status = "VERIFIED",
                dateVerified = "Aug 29, 2026",
                evidenceHash = "SHA256:1f77...bv-gmp-audit"
            ),
            TrustEvidence(
                id = "ev-06",
                projectId = "india-france-fragrance",
                category = "CERTIFICATIONS",
                title = "IFRA Standards Compliance (51st Amendment)",
                detail = "Formula safety audited against International Fragrance Association (IFRA) quantitative limits. Allergen concentration below EU safety thresholds.",
                issuerOrEvidence = "Independent Analytical Toxicology Lab (Eurofins Cosmetics Lab, Nantes)",
                status = "VERIFIED",
                dateVerified = "Sep 08, 2026",
                evidenceHash = "SHA256:88e4...ifra-51-cert"
            ),
            TrustEvidence(
                id = "ev-07",
                projectId = "india-france-fragrance",
                category = "CUSTOMER_EVIDENCE",
                title = "Pilot Cohort Blind Olfactory Evaluations",
                detail = "120 Parisian consumers evaluated blind samples in Marais pop-up: 89% rated longevity 'exceptional (8+ hrs)', 92% praised evocative monsoon earthiness.",
                issuerOrEvidence = "Sensory Testing Panel Report, Paris Niche Fragrance Study 2026",
                status = "VERIFIED",
                dateVerified = "Aug 18, 2026",
                evidenceHash = "SHA256:2d55...sensory-eval"
            ),
            TrustEvidence(
                id = "ev-08",
                projectId = "india-france-fragrance",
                category = "REVENUE_EVIDENCE",
                title = "Domestic Indian DTC Traction & Repeat Rate",
                detail = "₹48,00,000 (~€53,000) domestic pilot revenue generated across 1,800 orders with 34% 90-day repeat purchase rate and zero counterfeit claims.",
                issuerOrEvidence = "Stripe / Razorpay Chartered Accountant Verified Financial Statement",
                status = "VERIFIED",
                dateVerified = "Sep 01, 2026",
                evidenceHash = "SHA256:6b80...ca-reconciled"
            ),
            TrustEvidence(
                id = "ev-09",
                projectId = "india-france-fragrance",
                category = "TECHNICAL_CAPABILITY",
                title = "GC-MS Chemical Fingerprinting & Stability",
                detail = "Gas Chromatography-Mass Spectrometry (GC-MS) trace reports confirm zero DEP (diethyl phthalate), zero polycyclic musks, 3-year accelerated stability.",
                issuerOrEvidence = "Central Institute of Medicinal and Aromatic Plants (CIMAP Lucknow)",
                status = "VERIFIED",
                dateVerified = "Aug 05, 2026",
                evidenceHash = "SHA256:5a91...cimap-gcms"
            ),
            TrustEvidence(
                id = "ev-10",
                projectId = "india-france-fragrance",
                category = "SUPPLY_CHAIN_EVIDENCE",
                title = "Seed-to-Flacon Traceability & Batch #001 COA",
                detail = "Soil testing from Gangetic alluvial clay pits, flower harvest logs, copper deg distillation logs, Certificate of Analysis (COA) per batch drum.",
                issuerOrEvidence = "Batch QR Provenance Ledger #KNJ-2026-B001",
                status = "VERIFIED",
                dateVerified = "Sep 12, 2026",
                evidenceHash = "SHA256:91ac...batch-coa-001"
            ),
            TrustEvidence(
                id = "ev-11",
                projectId = "india-france-fragrance",
                category = "PARTNER_REFERENCES",
                title = "French Trade Advisor & Grasse Master Perfumer",
                detail = "Formal endorsement letter from Indo-French Chamber of Commerce (IFCCI) Luxury Committee & Grasse perfumer consultation referee.",
                issuerOrEvidence = "Indo-French Chamber of Commerce & Industry (Trade Ref #FR-IN-98)",
                status = "VERIFIED",
                dateVerified = "Aug 22, 2026",
                evidenceHash = "SHA256:3c84...ifcci-endorse"
            ),
            TrustEvidence(
                id = "ev-12",
                projectId = "india-france-fragrance",
                category = "COMPLIANCE_STATUS",
                title = "EU Cosmetics Regulation (EC) No 1223/2009",
                detail = "Cosmetic Product Safety Report (CPSR Part A & B) undergoing final sign-off with Paris toxicologist. CPNP notification pre-filled.",
                issuerOrEvidence = "Cosmetic Safety Consultant (Paris/Lyon), EU Dossier #CPNP-FR-7182",
                status = "IN_REVIEW",
                dateVerified = "Sep 15, 2026",
                evidenceHash = "SHA256:77bc...cpsr-draft-v3"
            ),
            TrustEvidence(
                id = "ev-13",
                projectId = "india-france-fragrance",
                category = "MARKET_READINESS",
                title = "Bilingual French Labeling & EORI Clearance",
                detail = "French INCI ingredient lists, batch code location, Responsible Person address formatted. French Customs EORI import authorization active.",
                issuerOrEvidence = "Direction Générale des Douanes et Droits Indirects (EORI: FR89201944)",
                status = "ACTION_REQUIRED",
                dateVerified = "Pending Final Packaging Proof",
                evidenceHash = "SHA256:pending-packaging-run"
            )
        )
        evidenceDao.insertEvidence(trustEvidenceList)

        // Global Partner Graph with Fit Scores for France Corridor
        val partnersList = listOf(
            GlobalPartner(
                id = "partner-01",
                corridor = "India -> France",
                role = "Responsible Person (RP)",
                name = "Dr. Éléonore Vasseur",
                organization = "Cosmétique Conseil & RP Paris",
                location = "75008 Paris, France",
                description = "EU-mandated legal Responsible Person with 18 years managing regulatory files for independent luxury cosmetic brands entering the EU.",
                productFit = 10,
                marketFit = 9,
                geographyFit = 10,
                capabilityFit = 10,
                trustFit = 10,
                costFit = 8,
                availabilityFit = 9,
                totalFitScore = 95,
                isVerified = true,
                outreachStatus = "In Discussion",
                samplePitchBrief = "Proposal: Retain Dr. Vasseur as official EU Responsible Person for CPNP notification and safety dossier custodian."
            ),
            GlobalPartner(
                id = "partner-02",
                corridor = "India -> France",
                role = "3PL Logistics & Temperature-Controlled Warehousing",
                name = "Antoine Mercier",
                organization = "Logistique Beauté France (Île-de-France)",
                location = "Roissy-en-France, France",
                description = "Specialized luxury cosmetics fulfillment center 15 minutes from CDG airport. Handles bonded customs clearance, temperature control at 18°C, and white-glove EU DTC shipping.",
                productFit = 9,
                marketFit = 10,
                geographyFit = 10,
                capabilityFit = 9,
                trustFit = 9,
                costFit = 8,
                availabilityFit = 9,
                totalFitScore = 91,
                isVerified = true,
                outreachStatus = "Outreach Ready",
                samplePitchBrief = "Brief: Storage of 2,000 flacons + 5,000 discovery sets with 24-hour dispatch across France, Germany, and Benelux."
            ),
            GlobalPartner(
                id = "partner-03",
                corridor = "India -> France",
                role = "Selective Niche Retail Buyer",
                name = "Claire Fontaine",
                organization = "L'Artisan Parfumeur & Niche Curators Guild",
                location = "Le Marais, Paris, France",
                description = "Head buyer and curator for 14 independent concept stores and luxury perfumeries in Paris, Lyon, and Bordeaux looking for authentic heritage storytelling.",
                productFit = 10,
                marketFit = 9,
                geographyFit = 9,
                capabilityFit = 9,
                trustFit = 8,
                costFit = 8,
                availabilityFit = 8,
                totalFitScore = 87,
                isVerified = true,
                outreachStatus = "Matched",
                samplePitchBrief = "Pitch: Exclusive launch partner for Kannauj Petrichor pure extraction in Paris with custom brass counter display."
            ),
            GlobalPartner(
                id = "partner-04",
                corridor = "India -> France",
                role = "French Luxury PR & Editorial Agency",
                name = "Maxime de Saint-Alphonse",
                organization = "L'Odorat Presse & Relations Publiques",
                location = "Saint-Germain-des-Prés, Paris",
                description = "Boutique luxury fragrance PR firm with direct editorial contacts at Vogue Paris, Elle France, Nez La Revue Olfactive, and Le Figaro.",
                productFit = 9,
                marketFit = 9,
                geographyFit = 9,
                capabilityFit = 8,
                trustFit = 8,
                costFit = 7,
                availabilityFit = 8,
                totalFitScore = 83,
                isVerified = false,
                outreachStatus = "Matched",
                samplePitchBrief = "Campaign: Narrative focus on the 400-year-old hydro-distillation of earth (Mitti Attar) as an artistic cultural bridge."
            ),
            GlobalPartner(
                id = "partner-05",
                corridor = "India -> France",
                role = "Cross-Border Trade & Angel Syndicate",
                name = "Marc-Olivier Dupont",
                organization = "Indo-European Consumer Bridge Capital",
                location = "Paris / Luxembourg",
                description = "Specialized cross-border angel vehicle co-founded by ex-LVMH and Indian retail executives financing inventory and distribution for heritage brands.",
                productFit = 9,
                marketFit = 9,
                geographyFit = 9,
                capabilityFit = 9,
                trustFit = 9,
                costFit = 9,
                availabilityFit = 8,
                totalFitScore = 89,
                isVerified = true,
                outreachStatus = "Outreach Ready",
                samplePitchBrief = "Term Sheet: €60,000 distributor advance / inventory credit line backed by confirmed French boutique orders."
            )
        )
        partnerDao.insertPartners(partnersList)

        // Capital Plan for Fragrance Launch
        val capitalPlan = CapitalPlan(
            id = "cap-india-france",
            projectId = "india-france-fragrance",
            targetAmountEur = 100000,
            manufacturingEur = 35000,
            complianceEur = 22000,
            inventoryEur = 18000,
            marketingEur = 15000,
            distributionEur = 10000,
            recommendedInstruments = "Tier 1: €30k Founder Equity + Tier 2: €40k French Distributor Advance / Purchase Order Financing + Tier 3: €30k Indian Export Promotion Grant (EPCG/MAI Scheme).",
            stageFitRecommendation = "Recommended Strategy: Avoid venture capital equity dilution at this stage. Your unit economics (€18 landed cost vs €145 retail) permit self-liquidating inventory financing with selective distributor advances."
        )
        capitalDao.insertCapitalPlan(capitalPlan)

        // Founder Identity
        val founderIdentity = FounderIdentity(
            id = "primary_founder",
            username = "amit.sharma",
            fullName = "Amit Sharma",
            companyName = "Kannauj Terroir Parfums Pvt Ltd",
            originCityCountry = "Kannauj & New Delhi, India",
            headline = "Heritage Perfume Formulator & Cross-Border Brand Architect",
            globalTrustScore = 88,
            skillsSummary = "Hydro-distillation chemistry, IFRA safety compliance, French market entry, DTC cross-border supply chains.",
            ipSummary = "Kannauj GI registered, Madrid Protocol Class 3 trademark, proprietary low-temperature distillation enfleurage protocol.",
            reputationProof = "13/13 Verifiable Evidence Vectors documented. Full dossier compiled and verified via Global Product OS."
        )
        identityDao.insertIdentity(founderIdentity)
    }
}
