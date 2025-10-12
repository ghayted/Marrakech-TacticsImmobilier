Write-Host "=== Déploiement Backend Simple (HTTP) ===" -ForegroundColor Green

Write-Host "1. Build du backend..." -ForegroundColor Yellow
cd AppStage\backend
dotnet publish -c Release -o ./publish

Write-Host "`n2. ✅ Fichiers prêts dans: AppStage\backend\publish\" -ForegroundColor Green

Write-Host "`n3. 📋 Instructions de déploiement:" -ForegroundColor Cyan
Write-Host "   a) Connectez-vous à votre serveur Oracle Cloud:" -ForegroundColor White
Write-Host "      ssh votre_utilisateur@144.24.30.248" -ForegroundColor Gray

Write-Host "`n   b) Arrêtez le service backend:" -ForegroundColor White
Write-Host "      sudo systemctl stop backend" -ForegroundColor Gray

Write-Host "`n   c) Sauvegardez l'ancienne version:" -ForegroundColor White
Write-Host "      sudo cp -r /var/www/backend /var/www/backend.backup" -ForegroundColor Gray

Write-Host "`n   d) Uploadez les nouveaux fichiers:" -ForegroundColor White
Write-Host "      Copiez le contenu de 'publish/' vers /var/www/backend/" -ForegroundColor Gray

Write-Host "`n   e) Redémarrez le service:" -ForegroundColor White
Write-Host "      sudo systemctl start backend" -ForegroundColor Gray

Write-Host "`n4. 🔧 Configuration actuelle:" -ForegroundColor Yellow
Write-Host "   - Backend: http://144.24.30.248:5257" -ForegroundColor White
Write-Host "   - Frontend: https://immotactics.live" -ForegroundColor White
Write-Host "   - CORS configuré pour les deux domaines" -ForegroundColor White

Write-Host "`n5. ✅ Après déploiement:" -ForegroundColor Yellow
Write-Host "   - Plus d'erreurs Mixed Content" -ForegroundColor White
Write-Host "   - Communication frontend-backend fonctionnelle" -ForegroundColor White
Write-Host "   - CORS correctement configuré" -ForegroundColor White

Write-Host "`n=== Prêt pour le déploiement ===" -ForegroundColor Green
