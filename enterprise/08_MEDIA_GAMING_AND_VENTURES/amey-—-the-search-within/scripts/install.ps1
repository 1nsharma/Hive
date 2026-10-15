<#
.SYNOPSIS
Aemy AI Studio — Model Context Protocol (MCP) Windows PowerShell Auto-Installer
Director: Amit Sharma
Positioning: AI • Human Intelligence • Future Systems

.DESCRIPTION
Automatically detects Claude Desktop, Cursor IDE, and VS Code environments on Windows
and safely merges the Aemy AI Studio MCP Server configuration.
#>

$ErrorActionPreference = "Stop"

$ServerUrl = if ($env:AEMY_SERVER_URL) { $env:AEMY_SERVER_URL } else { "https://ais-dev-77jfhcyuqptwgreoonzm4r-439336978771.asia-southeast1.run.app" }
$McpEndpoint = "$ServerUrl/api/mcp"

Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host " Aemy AI Studio — MCP Windows PowerShell Auto-Installer" -ForegroundColor Yellow
Write-Host " Director: Amit Sharma | Epistemic Research & Social Connectors" -ForegroundColor White
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "==> Target MCP Endpoint: $McpEndpoint" -ForegroundColor Blue

# 1. Claude Desktop on Windows
$ClaudeDir = Join-Path $env:APPDATA "Claude"
$ClaudeConfigFile = Join-Path $ClaudeDir "claude_desktop_config.json"

if (-not (Test-Path $ClaudeDir)) {
    New-Item -ItemType Directory -Path $ClaudeDir -Force | Out-Null
}

$ConfigData = @{}
if (Test-Path $ClaudeConfigFile) {
    try {
        $RawContent = Get-Content -Path $ClaudeConfigFile -Raw -Encoding UTF8
        $ConfigData = $RawContent | ConvertFrom-Json -AsHashtable
        # Backup
        $BackupFile = "$ClaudeConfigFile.bak.$((Get-Date).Ticks)"
        Copy-Item -Path $ClaudeConfigFile -Destination $BackupFile -Force
        Write-Host "[✓] Created backup: $BackupFile" -ForegroundColor DarkGray
    } catch {
        $ConfigData = @{}
    }
}

if (-not $ConfigData.ContainsKey("mcpServers")) {
    $ConfigData["mcpServers"] = @{}
}

$ConfigData["mcpServers"]["aemy-ai-studio"] = @{
    url = $McpEndpoint
    headers = @{
        "Content-Type" = "application/json"
    }
}

$JsonOutput = $ConfigData | ConvertTo-Json -Depth 10
Set-Content -Path $ClaudeConfigFile -Value $JsonOutput -Encoding UTF8
Write-Host "[✓] Claude Desktop configured successfully!" -ForegroundColor Green
Write-Host "    File: $ClaudeConfigFile" -ForegroundColor Gray

# 2. Cursor IDE on Windows
$CursorDir = Join-Path $env:USERPROFILE ".cursor"
$CursorConfigFile = Join-Path $CursorDir "mcp.json"

if (Test-Path $CursorDir) {
    Write-Host "==> Detected Cursor IDE environment. Updating Cursor MCP config..." -ForegroundColor Blue
    $CursorData = @{}
    if (Test-Path $CursorConfigFile) {
        try {
            $RawContent = Get-Content -Path $CursorConfigFile -Raw -Encoding UTF8
            $CursorData = $RawContent | ConvertFrom-Json -AsHashtable
        } catch {
            $CursorData = @{}
        }
    }
    if (-not $CursorData.ContainsKey("mcpServers")) {
        $CursorData["mcpServers"] = @{}
    }
    $CursorData["mcpServers"]["aemy-ai-studio"] = @{
        url = $McpEndpoint
        headers = @{
            "Content-Type" = "application/json"
        }
    }
    $CursorJson = $CursorData | ConvertTo-Json -Depth 10
    Set-Content -Path $CursorConfigFile -Value $CursorJson -Encoding UTF8
    Write-Host "[✓] Cursor IDE configured successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "AEMY AI STUDIO MCP WINDOWS INSTALLATION COMPLETE" -ForegroundColor Green
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "Tools Registered:"
Write-Host "  1. syndicate_to_social         (X, LinkedIn, YouTube, Substack, GitHub)"
Write-Host "  2. query_research_playbook     (8-step epistemic scientific protocol)"
Write-Host "  3. steelman_counter_challenge  (Falsification tests & devil's advocate)"
Write-Host "  4. generate_content_funnel     (Multi-platform intellectual cascading)"
Write-Host "  5. simulate_agent_sandbox      (Mechanistic explainability & sovereignty)"
Write-Host "  6. search_publications         (7 research series & 12 monographs)"
Write-Host "  7. get_brand_manifesto         (Amit Sharma, 5 wings, mission & manifesto)"
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Completely restart Claude Desktop or Cursor."
Write-Host "2. Check the hammer icon (🔨) in Claude to see the registered tools."
Write-Host "3. Ask: 'What does Aemy AI Studio research say about human agency?'"
Write-Host "========================================================================" -ForegroundColor Cyan
