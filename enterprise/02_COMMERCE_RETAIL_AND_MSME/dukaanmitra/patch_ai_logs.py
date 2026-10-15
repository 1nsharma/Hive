import re

with open("server.ts", "r") as f:
    content = f.read()

# Add logging to parse endpoint
parse_log_code = """
    // Log Agentic Action if user is authenticated
    if (req.dbUser) {
       await db.insert(userLogs).values({
          userId: req.dbUser.id,
          eventType: "ai_agent_action",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          metadata: JSON.stringify({
            action: "parse_munim",
            intent: "natural_language_to_action",
            context: { query: query, parsed_result: parsedResponse },
            status: "success"
          })
       });
    }
    
    res.json(parsedResponse);
"""
content = re.sub(
    r'    res\.json\(parsedResponse\);(\n\s*\} catch \(error)',
    parse_log_code + r'\1',
    content
)

# Add logging to scan-bill endpoint
scan_log_code = """
      // Log Agentic Action if user is authenticated
      if (req.dbUser) {
         await db.insert(userLogs).values({
            userId: req.dbUser.id,
            eventType: "ai_agent_action",
            ipAddress: req.ip,
            userAgent: req.headers["user-agent"],
            metadata: JSON.stringify({
              action: "scan_bill",
              intent: "ocr_extraction",
              context: { summary: parsedResponse.hindiSummary, total: parsedResponse.totalBillAmount },
              status: "success"
            })
         });
      }

      res.json(parsedResponse);
"""
content = re.sub(
    r'      res\.json\(parsedResponse\);(\n\s*\} catch \(error)',
    scan_log_code + r'\1',
    content
)

with open("server.ts", "w") as f:
    f.write(content)
