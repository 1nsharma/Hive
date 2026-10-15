import os
import glob
import re

agent_template = """import {{ globalAgentSandbox }} from '../os-core/agent-sandbox.js';
import {{ globalCommandBus, Command }} from '../os-core/command-bus.js';
import {{ DomainEvent }} from '../os-core/domain-events.js';

export class {class_name} {{
  readonly agentId = 'agent_{agent_id}';
  readonly permissions = ['READ_DOCS', 'UPDATE_DOCS'];

  constructor() {{
    globalAgentSandbox.setLimits(this.agentId, {{
      spendingLimit: 1000,
      rateLimitPerMinute: 60,
      allowedPermissions: this.permissions,
      requiresApproval: true
    }});
  }}

  async processDocument(event: DomainEvent) {{
    console.log(`[{class_name}] Processing document in category: {category_name}`);
    // Agent logic for {category_name}
  }}
}}

export const {instance_name} = new {class_name}();
"""

os.makedirs('src/agents', exist_ok=True)

directories = glob.glob('[0-2][0-9]. *')
for d in directories:
    # d is like "01. Strategy"
    match = re.match(r'\d+\.\s+(.*)', d)
    if match:
        name = match.group(1)
        safe_name = name.lower().replace(' ', '-')
        class_name = name.replace(' ', '') + "Agent"
        instance_name = name.replace(' ', '').lower() + "Agent"
        
        content = agent_template.format(
            class_name=class_name,
            agent_id=safe_name,
            category_name=name,
            instance_name=instance_name
        )
        
        file_path = f"src/agents/{safe_name}-agent.ts"
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Created {file_path}")

