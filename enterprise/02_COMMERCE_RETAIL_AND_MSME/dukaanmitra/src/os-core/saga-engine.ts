export interface SagaStep {
  name: string;
  execute: () => Promise<void>;
  compensate: () => Promise<void>;
}

export class SagaEngine {
  async runSaga(sagaId: string, steps: SagaStep[]) {
    const completedSteps: SagaStep[] = [];
    try {
      for (const step of steps) {
        await step.execute();
        completedSteps.push(step);
      }
      return { success: true };
    } catch (error: any) {
      console.error(`[SagaEngine] Execution failed at step. Starting compensation. Error: ${error.message}`);
      // Rollback in reverse order
      for (const step of completedSteps.reverse()) {
        try {
          console.log(`[SagaEngine] Compensating step: ${step.name}`);
          await step.compensate();
        } catch (compError) {
          console.error(`[SagaEngine] Compensation failed for step ${step.name}:`, compError);
        }
      }
      return { success: false, error: error.message };
    }
  }
}
export const globalSagaEngine = new SagaEngine();
