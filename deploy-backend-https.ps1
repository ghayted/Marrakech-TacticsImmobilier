Write-Host "=== Déploiement Backend avec HTTPS ===" -ForegroundColor Green

Write-Host "1. Build du backend avec les modifications CORS et HTTPS..." -ForegroundColor Yellow
cd AppStage\backend
dotnet publish -c Release -o ./publish

Write-Host "`n2. Fichiers prêts pour le déploiement dans: AppStage\backend\publish\" -ForegroundColor Green

Write-Host "`n3. Instructions pour déployer sur Oracle Cloud:" -ForegroundColor Cyan
Write-Host "   a) Connectez-vous à votre serveur:" -ForegroundColor White
Write-Host "      ssh votre_utilisateur@144.24.30.248" -ForegroundColor Gray

Write-Host "`n   b) Arrêtez le service backend:" -ForegroundColor White
Write-Host "      sudo systemctl stop backend" -ForegroundColor Gray

Write-Host "`n   c) Sauvegardez l'ancienne version:" -ForegroundColor White
Write-Host "      sudo cp -r /var/www/backend /var/www/backend.backup" -ForegroundColor Gray

Write-Host "`n   d) Uploadez les nouveaux fichiers:" -ForegroundColor White
Write-Host "      Utilisez WinSCP, FileZilla ou SCP pour copier le contenu de 'publish/' vers /var/www/backend/" -ForegroundColor Gray

Write-Host "`n   e) Redémarrez le service:" -ForegroundColor White
Write-Host "      sudo systemctl start backend" -ForegroundColor Gray

Write-Host "`n4. Configuration HTTPS:" -ForegroundColor Yellow
Write-Host "   - Votre backend écoutera sur le port 5258 (HTTPS)" -ForegroundColor White
Write-Host "   - Le frontend utilisera automatiquement HTTPS" -ForegroundColor White
Write-Host "   - Un certificat auto-signé sera généré" -ForegroundColor White

Write-Host "`n5. Test après déploiement:" -ForegroundColor Yellow
Write-Host "   - https://144.24.30.248:5258 (backend HTTPS)" -ForegroundColor White
Write-Host "   - https://immotactics.live (frontend)" -ForegroundColor White

Write-Host "`n=== Déploiement prêt ===" -ForegroundColor Green
