# Sensi-BD

Nom commercial : LEEAF

Le contexte :

Projet de fin de formation. En équipe, from scratch en 4 semaines, du cachier des charges à la démo d'un minimum viable product.

La présentation du projet :

Sensi-BD est une plateforme de dons de supports presse (BD/Livre/Magazine) entre particuliers sur le thème précis de l’écologie. L’idée étant de pouvoir donner des supports déjà lus pour partager le savoir, ou d’enrichir son savoir en récupérant gratuitement des supports donnés par la communauté.

La définition des besoins :

Dans un contexte d’inflation généralisée notamment sur la presse (prix du papier, du transport…) et de crise écologique pour laquelle il faut mobiliser malgré tout, il est important de permettre à chacun d’accéder à plus de connaissances, peu importe ses moyens ou son âge.

## Installation

Commencez par installer les dépendences avec la commande : npm i
Cette plateforme se base principalement sur :

- axios
- react
- react-dom
- react-google-autocomplete
- react-infinite-scroll-component
- react-redux
- react-router-dom
- vite
- typescript
- sass

Cette application se sert d'une API google pour l'autocompletion de l'adresse de l'utilisateur à son inscription.
Il vous faut créer un .env sur la base du .env.example et vous fournir une clé API en vous créant un projet sur Google Cloud et son service Geocode.

## Style

Nous utilisons ici la librairie Material UI.

## Fonctionnalités

- Voir des annonces avec un scroll par paquet
- Se créer un compte avec hash du password et autocomplétion de l'adresse
- Se connecter avec retour d'un JWT
- Créer une annonce avec envoie de l'image dans un bucket AWS service S3
- Échanger avec un autre utilisateur sous forme de chat type forum
- Voir les discussion en cours
- Voir son profil
- Se déconnecter

Note : le temps nous a manqué pour mettre en place de le filtre des annonces par géolocalisation. Bien que nous ayons implémenté de service Google map.

## Utilisation

Cette application se base sur une API back nommée SensiBD-back que vous trouverez dans mes dossiers.

## Auteurs

côté front : Vincent berdillon et Vincent Bommert

côté back : Julien Serbielle et Olivier Jean-Baptiste
