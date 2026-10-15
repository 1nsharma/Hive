package com.example.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.example.data.model.CapitalPlan
import com.example.data.model.FounderIdentity
import com.example.data.model.GlobalPartner
import com.example.data.model.LaunchProject
import com.example.data.model.TrustEvidence

@Database(
    entities = [
        LaunchProject::class,
        TrustEvidence::class,
        GlobalPartner::class,
        CapitalPlan::class,
        FounderIdentity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class GlobalBridgeDatabase : RoomDatabase() {
    abstract fun launchProjectDao(): LaunchProjectDao
    abstract fun trustEvidenceDao(): TrustEvidenceDao
    abstract fun globalPartnerDao(): GlobalPartnerDao
    abstract fun capitalPlanDao(): CapitalPlanDao
    abstract fun founderIdentityDao(): FounderIdentityDao

    companion object {
        @Volatile
        private var INSTANCE: GlobalBridgeDatabase? = null

        fun getDatabase(context: Context): GlobalBridgeDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    GlobalBridgeDatabase::class.java,
                    "global_bridge_db"
                ).fallbackToDestructiveMigration(dropAllTables = true).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
