' scripts/autostart_background.vbs - Inicialização invisível e resiliente em segundo plano
Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\luciano\.gemini\antigravity\scratch\soundworld"
WshShell.Run "node server.js", 0, False
