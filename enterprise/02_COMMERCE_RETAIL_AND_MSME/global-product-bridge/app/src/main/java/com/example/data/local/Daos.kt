package com.example.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.example.data.model.CapitalPlan
import com.example.data.model.FounderIdentity
import com.example.data.model.GlobalPartner
import com.example.data.model.LaunchProject
import com.example.data.model.TrustEvidence
import kotlinx.coroutines.flow.Flow

@Dao
interface LaunchProjectDao {
    @Query("SELECT * FROM launch_projects ORDER BY isFlagship DESC, title ASC")
    fun getAllProjects(): Flow<List<LaunchProject>>

    @Query("SELECT * FROM launch_projects WHERE id = :id LIMIT 1")
    fun getProjectById(id: String): Flow<LaunchProject?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProject(project: LaunchProject)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertProjects(projects: List<LaunchProject>)

    @Update
    suspend fun updateProject(project: LaunchProject)
}

@Dao
interface TrustEvidenceDao {
    @Query("SELECT * FROM trust_evidence WHERE projectId = :projectId ORDER BY id ASC")
    fun getEvidenceForProject(projectId: String): Flow<List<TrustEvidence>>

    @Query("SELECT * FROM trust_evidence ORDER BY id ASC")
    fun getAllEvidence(): Flow<List<TrustEvidence>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvidence(evidence: List<TrustEvidence>)

    @Update
    suspend fun updateEvidence(evidence: TrustEvidence)

    @Query("UPDATE trust_evidence SET status = :status WHERE id = :id")
    suspend fun updateEvidenceStatus(id: String, status: String)
}

@Dao
interface GlobalPartnerDao {
    @Query("SELECT * FROM global_partners ORDER BY totalFitScore DESC")
    fun getAllPartners(): Flow<List<GlobalPartner>>

    @Query("SELECT * FROM global_partners WHERE corridor = :corridor ORDER BY totalFitScore DESC")
    fun getPartnersForCorridor(corridor: String): Flow<List<GlobalPartner>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPartners(partners: List<GlobalPartner>)

    @Update
    suspend fun updatePartner(partner: GlobalPartner)
}

@Dao
interface CapitalPlanDao {
    @Query("SELECT * FROM capital_plans WHERE projectId = :projectId LIMIT 1")
    fun getCapitalPlan(projectId: String): Flow<CapitalPlan?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCapitalPlan(plan: CapitalPlan)
}

@Dao
interface FounderIdentityDao {
    @Query("SELECT * FROM founder_identity WHERE id = 'primary_founder' LIMIT 1")
    fun getPrimaryIdentity(): Flow<FounderIdentity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertIdentity(identity: FounderIdentity)
}
