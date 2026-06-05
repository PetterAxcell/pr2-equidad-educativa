# Resumen de calidad de datos

## Cobertura

- Sistemas educativos incluidos: 14
- Registros en `pisa_scores.csv`: 126
- Registros en `talis_ai_use.csv`: 14
- Registros en `talis_ai_training.csv`: 14
- Registros en `sdg_digital_infrastructure.csv`: 28

## Valores no disponibles

- Puntuaciones PISA no disponibles: 3
- Indicadores UNESCO no disponibles: 0

Los valores no disponibles se conservan como celdas vacías en CSV y como `null`
en JSON. No se interpolan ni se sustituyen por medias.

## Fuentes usadas

- OECD PISA 2022 Results, Volume I, StatLinks de los capítulos 5 y 6.
- OECD TALIS 2024 Results, tablas 1.59 a 1.63, 4.22 y 4.27.
- UNESCO UIS SDG 4 Education Indicators, indicador 4.a.1.

## Nota metodológica

La visualización compara adopción, percepciones, preparación docente,
infraestructura digital y resultados académicos agregados. No afirma causalidad
entre uso de IA y rendimiento PISA.
