# Script de déploiement pour Oracle Cloud Server
# Ce script vous aide à déployer votre backend sur Oracle Cloud

Write-Host "=== Déploiement Backend vers Oracle Cloud ===" -ForegroundColor Green

# Variables de configuration
$SERVER_IP = "144.24.30.248"
$SERVER_PORT = "5257"
$USERNAME = ""  # Remplacez par votre nom d'utilisateur Oracle Cloud
$PUBLISH_FOLDER = "AppStage\backend\publish"

Write-Host "1. Vérification des fichiers à déployer..." -ForegroundColor Yellow
if (Test-Path $PUBLISH_FOLDER) {
    Write-Host "✓ Dossier publish trouvé" -ForegroundColor Green
    Get-ChildItem $PUBLISH_FOLDER | Measure-Object | ForEach-Object { Write-Host "  - $($_.Count) fichiers à déployer" }
} else {
    Write-Host "✗ Dossier publish introuvable. Exécutez d'abord: dotnet publish -c Release -o ./publish" -ForegroundColor Red
    exit 1
}

Write-Host "`n2. Instructions pour le déploiement sur Oracle Cloud:" -ForegroundColor Yellow
Write-Host "   a) Connectez-vous à votre serveur Oracle Cloud via SSH:" -ForegroundColor Cyan
Write-Host "      ssh $USERNAME@$SERVER_IP" -ForegroundColor White

Write-Host "`n   b) Arrêtez le service backend actuel:" -ForegroundColor Cyan
Write-Host "      sudo systemctl stop backend" -ForegroundColor White
Write-Host "      # ou si vous utilisez PM2: pm2 stop backend" -ForegroundColor Gray

Write-Host "`n   c) Créez un backup de l'ancienne version:" -ForegroundColor Cyan
Write-Host "      sudo cp -r /var/www/backend /var/www/backend.backup.$(date +%Y%m%d_%H%M%S)" -ForegroundColor White

Write-Host "`n   d) Uploadez les nouveaux fichiers (utilisez WinSCP, FileZilla, ou SCP):" -ForegroundColor Cyan
Write-Host "      scp -r $PUBLISH_FOLDER/* $USERNAME@$SERVER_IP:/var/www/backend/" -ForegroundColor White

Write-Host "`n   e) Redémarrez le service:" -ForegroundColor Cyan
Write-Host "      sudo systemctl start backend" -ForegroundColor White
Write-Host "      sudo systemctl enable backend" -ForegroundColor White

Write-Host "`n3. Test de connectivité après déploiement:" -ForegroundColor Yellow
Write-Host "   curl -X GET http://$SERVER_IP`:$SERVER_PORT" -ForegroundColor White

Write-Host "`n4. Vérification des logs:" -ForegroundColor Yellow
Write-Host "   sudo journalctl -u backend -f" -ForegroundColor White

Write-Host "`n=== Instructions complètes ===" -ForegroundColor Green
Write-Host "Votre backend avec les modifications CORS est prêt dans le dossier: $PUBLISH_FOLDER"
Write-Host "Suivez les étapes ci-dessus pour déployer sur votre serveur Oracle Cloud."
Write-Host "Une fois déployé, votre site Netlify devrait pouvoir communiquer avec le backend !"
