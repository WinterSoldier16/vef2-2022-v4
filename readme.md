# Vefforritun 2, 2022. Verkefni 4: Viðburðakerfis framendi

[Kynning á verkefni í tíma](https://youtu.be/Sc0vW-5zylM).

Verkefnið er endurgerð á [verkefni 2](https://github.com/vefforritun/vef2-2022-v2/) með React og nýtir vefþjónustur úr [verkefni 3](https://github.com/vefforritun/vef2-2022-v3/).

Búa skal til React framenda ofan á vefþjónustur fyrir viðburðakerfið.

Eftirfarandi eru markmið verkefnisins:

* Kynnast React og hvernig við notum það til að útbúa framenda og viðmót
* Uppsetning á react components og skiptingu á mismunandi viðmótseiningum
* Props og state
* Prófanir á react component
* React router til að sjá um routing

## Viðmót

Notast skal við sama viðmót og í verkefni 2, eða bæta við og breyta eins og ykkur listir.

Leyfilegt er að nota CSS og það sem kemur fyrir í sýnilausn að verkefni 2.

## Vefþjónustur og gögn

Viðburði skal sækja úr vefþjónustu, annað hvort gefinni [vefþjónustu fyrir sýnilausn á verkefni 3](https://vef2-20222-v3-synilausn.herokuapp.com/), eða ykkar eigin vefþjónustu úr verkefni 3. Athugið að krafa er um að birta skráningar per viðburð sem ekki var krafa í verkefni 3, þannig að ef þið notið ykkar eigin þarf að bæta þeirri virkni við.

Á forsíðu eru viðburðir frá `/events` birtir, fyrir hvern viðburð eru gögn sótt á `/events/:id`. Ekki þarf að útfæra síðuflettingu (e. paging) í viðmóti.

Annar texti sem ekki er til staðar í vefþjónustu skal setja beint inn í verkefnið.

## Virkni

Farið er yfir virkni í [myndbandi](v4.mp4).

Setja skal upp þrjár síður:

* Forsíðu sem birtir lista af viðburðum frá vefþjónustu
* Stakan viðburð með upplýsingum um viðburð, skráningar og möguleika á að skrá sig, sjá að neðan
* Innskráningarsíðu sem birtir aðeins form

Í `App` component skal halda utan um síður og stöðu á innskráningu.

Nota skal [react router, útgáfu 6](https://reactrouter.com/docs/en/v6) til að setja upp routing og nota það til að viðhalda stöðu á milli síðna. Athugið að dæmi í námsefni nota útgáfu 5 og eru einhverjar breytingar á milli útgáfna.

Búa skal til a.m.k. fimm componenta sem halda utan um viðeigandi stöðu og taka við gögnum gegnum props:

* `Event` component sem birtir upplýsingar um stakan viðburð, getur verið aðskilinn frá síðunni (sem þá sækir gögnin sem þessi component birtir gegnum props)
* `Events` component sem birtir upplýsingar um lista af viðburðum, getur verið aðskilinn frá síðunni (sem þá sækir gögnin sem þessi component birtir gegnum props)
* `Layout` component sem heldur utan um header, efni og footer á síðu
* `Login` component sem heldur utan um innskráningar link, nýskráningar takka. Birtir að notandi sé innskráður og möguleika til að skrá sig út
* Form componenta, t.d. `Input`, `Form` og `Button`

## Gerviinnskráning

Ekki þarf að útfæra innskráningu á móti vefþjónustu á þessu stigi, en útfæra skal gerviinnskráningu.

Í `App` er haldið utan um stöðu á innskráningu og hún send niður í viðeigandi componenta. Í `Login` component er möguleiki á að nýskrá sig, en við það er stöðu breytt í að notandi sé innskráður. Þá er möguleiki á að breyta stöðu aftur í óinnskráða með því að nota `útskrá` takka.

Ef notandi er innskráður birtist möguleiki á að skrá sig með athugasemd á viðburða síðu. Ef ýtt er á þann takka heldur sá viðburður utan um að notandi sé skráður *aðeins* á meðan notandi er á þeirri síðu. Ekkert þarf að gera við skráða athugasemd.

## Tæki, tól og test

Setja skal upp verkefni með `create react app` (CRA).

Setja skal upp `eslint` gegnum CRA. Engar villur skulu vera til staðar.

`jest` kemur uppsett með CRA. Skrifa skal test fyrir a.m.k. tvo componenta. Nota skal [Testing Library](https://testing-library.com/docs/) til að útbúa test.

Setja skal upp vefinn á Netlify eða Heroku tengt við GitHub, tengjast skal vefþjónustu, annað hvort gefinni [vefþjónustu fyrir sýnilausn á verkefni 3](https://vef2-20222-v3-synilausn.herokuapp.com/), eða ykkar eigin vefþjónustu úr verkefni 3, gefið að búið sé að bæta við hana að birta skráningar.

## Mat

* 20% Verkefni sett upp með CRA og síður skilgreindar með react router
* 20% Viðburðalisti sóttur gegnum vefþjónustu og birtur
* 20% Stakur viðburður sóttur gegnum vefþjónustu og birtur með öllum gögnum
* 20% „Gerviinnskráning“ útfærð og stöðu hennar viðhaldið gegnum forritið
* 20% Tæki, tól og test, verkefni sett upp á Netlify eða Heroku

## Sett fyrir

Verkefni sett fyrir í fyrirlestri miðvikudaginn 2. mars 2022.

## Skil

Skila skal í Canvas í seinasta lagi fyrir lok dags föstudaginn 18. mars 2022.

Skil skulu innihalda:

* Slóð á verkefni keyrandi á Netlify eða Heroku
* Slóð á GitHub repo fyrir verkefni. Dæmatímakennurum skal hafa verið boðið í repo. Notendanöfn þeirra eru:
  * `MarzukIngi`
  * `WhackingCheese`

---

> Útgáfa 0.1
| Útgáfa | Breyting                                     |
|--------|----------------------------------------------|
| 0.1    | Fyrsta útgáfa                                |