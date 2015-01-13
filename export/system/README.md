# EXTRACTION GEOGRAPHIQUE


## PRESENTATION DU TRAVAIL 

	Cet outil consiste � fournir une interface graphique (client web) qui va permettre de s�lectionner une zone du monde par l�interm�diaire 
	d�une carte 2D afin de r�cup�rer les donn�es g�ographiques pr�sente dans la s�lection. 
	La carte 2D est fournie par notre serveur � l�aide des services WMS et WFS.
	On peut r�cup�rer ces donn�es dans 2 formats : 
		-	Raster : image GeoTIFF dont on peut modifier la r�solution 
		- 	Vecteur : zip shapefiles


## INSTALLATION 
	
	L'installation de notre projet se d�coupe en 2 parties.
	
	Une partie 'Base' que nous avons d�velopp� pour l'ensemble des groupes qui installe :
		- via le setup.sh : 
			-	le serveur web (Tomcat)
			-	la base de donn�es (PostgreSQL/PostGIS)
			-	le serveur cartographique (GeoServer)
		- via import.sh : 
			- 	toutes les donn�es vecteur Natural Earth n�cessaires pour l'ensemble des groupes
			- 	une donn�e raster � 10m de pr�cision
	
	Une partie 'Export' qui installe notre application web sur le serveur :
		- via le setup.sh : 
			-	les fichiers HTML et javascript sur le serveur Tomcat
		- via import.sh : 
			- 	pour le moment il n'y a aucune donn�e import�e mais par la suite, ce dossier peut servir
	
	Pour lancer l'installation, il faut faire pour chaque partie les 2 points d�crits ci-dessous :
		-	Lancer le script setup.sh dans un terminal. -> placez vous dans le r�pertoire qui contient le script avec la commande `cd PATH`
			o� PATH repr�sente le chemin vers le r�pertoire. Puis ex�cutez la commande : `./setup.sh`
	
		-	Lancer le script import.sh dans un terminal. -> placez vous dans le r�pertoire qui contient le script avec la commande `cd PATH`
			o� PATH repr�sente le chemin vers le r�pertoire. Puis ex�cutez la commande : `./import.sh`
	

## UTILISATION	

### LE FOND CARTOGRAPHIQUE 
	
	Tous les fonds cartographiques disponibles sur GeoServer sont dynamiquement propos�s via notre interface.
	Le fond de carte se change � la s�lection dans une liste d�roulante.

	
### LA SELECTION DE ZONE GEOGRAPHIQUE 
	
	-	Pour s�lectionner une zone g�ographique sur la carte vous avez deux possibilit�s : 
			-	Rentrer manuellement les coordonn�es dans la bounding box (les deux longitudes et latitudes des c�t�s du rectangle)  
			-	Rester appuyer sur la touche <maj> et maintenez le clique de la souris pour s�lectionner la zone sur la carte.
				La zone s�lectionn�e sera alors affich�e en couleur verte transparente.
	
	ATTENTION : La valeur du bord gauche ne doit pas �tre sup�rieure � celle du bord droit 
				et la valeur du bord haut ne doit pas �tre inf�rieure � celle du bord bas
		
	
### LE TELECHARGEMENT	
	
	L'interface propose au t�l�chargement toutes les couches au format raster et au format vecteur pour les couches qui le permettent.
	-	Pour t�l�charger une zone g�ographique il faut : 
			-	Que la zone g�ographique ne soit pas nulle (qu'il y ait une zone d�j� pr�selectionn�e).
			-	Appuyer sur le bouton "Download" apr�s avoir choisi le format que vous souhaitez (Vecteur ou Raster). 
		
	
### LA FENETRE 
	
	-	Vous pouvez r�duire la fen�tre pop-up qui contient la bounding box. Celle-ci se placera en bas � gauche de votre �cran. 
	-	Vous pourrez toujours la restaurer.
		
	
### LE DEPLACEMENT
	
	-	Vous pouvez vous d�placer sur la carte en restant appuyer sur le clique gauche sur la carte et en d�pla�ant la souris.
	
	
### LE ZOOM
	
	-	Vous pouvez zoomer sur la carte en double cliquant ou en utilisant le bouton '+' en haut � gauche de la fen�tre.
	-	Vous pouvez d�zoomer sur la carte en utilisant le bouton '-' en haut � gauche de la fen�tre.
	-	Vous pouvez aussi r�gler le zoom en faisant un pinch sur le pad (si vous en avez un) de votre ordinateur.
	
	
## LIMITE DE L'OUTIL

	Etant donn� que le protocole WMS/WFS de l'OGC attend une bounding box, on ne peut s�lectionner que des zones g�ographiques rectangulaires. 
	
	
## AUTEURS

	-	Julien Kazemifard, Informatique et G�omatique, ESIPE 2015
	-	R�my Lallemand, Informatique et G�omatique, ESIPE 2015

## DATE

	Le 13/01/2015