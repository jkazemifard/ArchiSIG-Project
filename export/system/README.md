# EXTRACTION GEOGRAPHIQUE


## PRESENTATION DU TRAVAIL 

	Cet outil consiste à fournir une interface graphique (client web) qui va permettre de sélectionner une zone du monde par l’intermédiaire 
	d’une carte 2D afin de récupérer les données géographiques présente dans la sélection. 
	La carte 2D est fournie par notre serveur à l’aide des services WMS et WFS.
	On peut récupérer ces données dans 2 formats : 
		-	Raster : image GeoTIFF dont on peut modifier la résolution 
		- 	Vecteur : zip shapefiles


## INSTALLATION 
	
	L'installation de notre projet se découpe en 2 parties.
	
	Une partie 'Base' que nous avons développé pour l'ensemble des groupes qui installe :
		- via le setup.sh : 
			-	le serveur web (Tomcat)
			-	la base de données (PostgreSQL/PostGIS)
			-	le serveur cartographique (GeoServer)
		- via import.sh : 
			- 	toutes les données vecteur Natural Earth nécessaires pour l'ensemble des groupes
			- 	une donnée raster à 10m de précision
	
	Une partie 'Export' qui installe notre application web sur le serveur :
		- via le setup.sh : 
			-	les fichiers HTML et javascript sur le serveur Tomcat
		- via import.sh : 
			- 	pour le moment il n'y a aucune donnée importée mais par la suite, ce dossier peut servir
	
	Pour lancer l'installation, il faut faire pour chaque partie les 2 points décrits ci-dessous :
		-	Lancer le script setup.sh dans un terminal. -> placez vous dans le répertoire qui contient le script avec la commande `cd PATH`
			où PATH représente le chemin vers le répertoire. Puis exécutez la commande : `./setup.sh`
	
		-	Lancer le script import.sh dans un terminal. -> placez vous dans le répertoire qui contient le script avec la commande `cd PATH`
			où PATH représente le chemin vers le répertoire. Puis exécutez la commande : `./import.sh`
	

## UTILISATION	

### LE FOND CARTOGRAPHIQUE 
	
	Tous les fonds cartographiques disponibles sur GeoServer sont dynamiquement proposés via notre interface.
	Le fond de carte se change à la sélection dans une liste déroulante.

	
### LA SELECTION DE ZONE GEOGRAPHIQUE 
	
	-	Pour sélectionner une zone géographique sur la carte vous avez deux possibilités : 
			-	Rentrer manuellement les coordonnées dans la bounding box (les deux longitudes et latitudes des côtés du rectangle)  
			-	Rester appuyer sur la touche <maj> et maintenez le clique de la souris pour sélectionner la zone sur la carte.
				La zone sélectionnée sera alors affichée en couleur verte transparente.
	
	ATTENTION : La valeur du bord gauche ne doit pas être supérieure à celle du bord droit 
				et la valeur du bord haut ne doit pas être inférieure à celle du bord bas
		
	
### LE TELECHARGEMENT	
	
	L'interface propose au téléchargement toutes les couches au format raster et au format vecteur pour les couches qui le permettent.
	-	Pour télécharger une zone géographique il faut : 
			-	Que la zone géographique ne soit pas nulle (qu'il y ait une zone déjà préselectionnée).
			-	Appuyer sur le bouton "Download" après avoir choisi le format que vous souhaitez (Vecteur ou Raster). 
		
	
### LA FENETRE 
	
	-	Vous pouvez réduire la fenêtre pop-up qui contient la bounding box. Celle-ci se placera en bas à gauche de votre écran. 
	-	Vous pourrez toujours la restaurer.
		
	
### LE DEPLACEMENT
	
	-	Vous pouvez vous déplacer sur la carte en restant appuyer sur le clique gauche sur la carte et en déplaçant la souris.
	
	
### LE ZOOM
	
	-	Vous pouvez zoomer sur la carte en double cliquant ou en utilisant le bouton '+' en haut à gauche de la fenêtre.
	-	Vous pouvez dézoomer sur la carte en utilisant le bouton '-' en haut à gauche de la fenêtre.
	-	Vous pouvez aussi régler le zoom en faisant un pinch sur le pad (si vous en avez un) de votre ordinateur.
	
	
## LIMITE DE L'OUTIL

	Etant donné que le protocole WMS/WFS de l'OGC attend une bounding box, on ne peut sélectionner que des zones géographiques rectangulaires. 
	
	
## AUTEURS

	-	Julien Kazemifard, Informatique et Géomatique, ESIPE 2015
	-	Rémy Lallemand, Informatique et Géomatique, ESIPE 2015

## DATE

	Le 13/01/2015