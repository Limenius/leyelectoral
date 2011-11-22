<?php
function random_color(){
    $c = '';
    while(strlen($c)<6){
        $c .= sprintf("%02X", mt_rand(0, 255));
    }
    return $c;
}

$parties = array(
    "p-s-o-e" => "PSOE",
    "p-p" => "PP",
    "i-u" => "IU",
    "ciu" => "CiU",
    "upyd" => "UPyD",
    "eaj-pnv" => "PNV",
    "esquerra" => "ERC",
    "b-n-g" => "BNG.",
    "cc-pnc" => "CC",
    "ca" => "CA",
    "na-bai" => "Na-Bai",
    "ea" => "EA",
    "c-s" => "C's",
    "pacma" => "PACMA",
    "verdes" => "VERDES",
    "par" => "PAR",
    "cha" => "CHA",
    "nc-ccn" => "NC-CCN",
    "lv-gv" => "LV-GV",
    "aralar" => "aralar",
    "bloc-idpv-ev-ee" => "BLOC-IDPV-EV-EE",
    "unitat-per-les-illes" => "U. Illes",
    "pum-j" => "PUM+J",
    "lve" => "LVE",
    "p-c-p-e" => "P.C.P.E.",
    "p-s-d" => "P.S.D.",
    "cenb" => "CENB",
    "fe-de-las-jons" => "FE de las JONS",
    "d-n" => "D.N.",
    "ev-ae" => "EV-AE",
    "pfyv" => "PFyV",
    "pdeal" => "PdeAL",
    "ph" => "PH",
    "rcn-nok" => "RCN-NOK",
    "ev-lv" => "EV-LV",
    "aes" => "AES",
    "p-o-s-i" => "P.O.S.I.",
    "e-2000" => "E-2000",
    "rc" => "RC",
    "cva" => "CVa",
    "ei" => "Ei",
    "tc" => "TC",
    "f-a" => "F.A.",
    "upl" => "UPL",
    "amd" => "AMD",
    "sain" => "SAIn",
    "pdlpea" => "PDLPEA",
    "ir" => "IR",
    "partido-riojano" => "PARTIDO RIOJANO",
    "a-u-n" => "A.u.N.",
    "abla" => "ABLA",
    "extremadura-unida" => "EXTREMADURA UNIDA",
    "e-v-a-v" => "E.V.-A.V.",
    "p-c" => "P.C.",
    "pxcat" => "PxCat",
    "pnf-no-fumadores" => "PNF (NO-FUMADORES)",
    "uleg" => "ULEG",
    "o-n-v" => "O.N.V.",
    "c-d-l" => "C.D.L.",
    "frente" => "FRENTE",
    "c-d-s" => "C.D.S.",
    "aa" => "AA",
    "prepal" => "PREPAL",
    "c-d-es" => "C.D.Es.",
    "anc" => "ANC",
    "plci" => "PLCI",
    "unida" => "UNIDA",
    "p-l-e-v-e" => "P.L.E.V.E.",
    "li-litci" => "LI-LITCI",
    "unidad-del-pueblo" => "UNIDAD DEL PUEBLO",
    "plrv" => "plRV",
    "centristas-pctr" => "Centristas PCTR",
    "pcua" => "pCUA",
    "ucpic" => "UCPIC",
    "irv" => "IRV",
    "mupc" => "MUPC",
    "u-r-c-l" => "U.R.C.L.",
    "puede" => "PUEDE",
    "piib" => "PIIB",
    "ppcr" => "PPCr",
    "pb-ub" => "PB-UB",
    "c-t-c" => "C.T.C.",
    "ud-ca" => "Ud. Ca.",
    "i-m-c" => "I.M.C.",
    "p-r-gu" => "P.R.GU.",
    "paie" => "PAIE",
    "td" => "TD",
    "cdas" => "CDAS",
    "aba" => "ABA",
    "ave" => "AVE",
    "ucl" => "UCL",
    "n-som" => "N som",
    "axb" => "AxB",
    "ixc" => "ixC",
    "i-c-bur" => "I.C.Bur",
    "agruci" => "AGRUCI",
    "m-f-e" => "M.F.E.",
    "phache" => "PHache"
);

$colors = array();

foreach (array_keys($parties) as $party){
    $colors[$party] = random_color();

}

$colors["p-s-o-e"] = "d41d05";
$colors["p-p"]     = "019ee5";
$colors["i-u"]     = "016e52";
$colors["ciu"]     = "000e62";
$colors["upyd"]     = "e4007b";
$colors["eaj-pnv"]     = "b2bb1e";
$colors["esquerra"]     = "e5aa01";
$colors["b-n-g"]     = "b4d0e7";
$colors["cc-pnc"]     = "ffec01";
$colors["ca"]     = "70814d";
$colors["na-bai"]     = "8c4d97";
$colors["ea"]     = "6db23e";
$colors["c-s"]     = "ff6e2d";
$colors["lv-gv"]     = "028d34";
$colors["cha"]     = "a8021a";
$colors["unitat-per-les-illes"]     = "f51111";
$colors["nc-ccn"]     = "9d5e08";

$parties2011 = array(
    "partido-popular-pp" => "PP",
    "partido-socialista-obrero-espa-ol-psoe" => "PSOE",
    "converg-egrave-ncia-i-uni-oacute-ciu" => "CiU",
    "izquierda-unida-los-verdes-iu-lv" => "IU",
    "amaiur-amaiur" => "Amaiur",
    "uni-oacute-n-progreso-y-democracia-upyd" => "UPyD",
    "euzko-alderdi-jeltzalea-partido-nacionalista-vasco-eaj-pnv" => "PNV",
    "esquerra-republicana-de-catalunya-erc-ri-cat" => "ERC",
    "bloque-nacionalista-galego-bng" => "BNG",
    "coalici-oacute-n-canaria-nueva-canarias-cc-nc-pnc" => "CC",
    "bloc-iniciativa-verds-equo-coalici-oacute-comprom-iacute-s-comprom-iacute-s-q" => "Compromís",
    "foro-de-ciudadanos-fac" => "FAC",
    "geroa-bai-gbai" => "GBAI",
    "equo-equo" => "EQUO",
    "plataforma-per-catalunya-pxc" => "PxC",
    "partido-regionalista-de-cantabria-prc" => "PRC",
    "psm-iniciativaverds-entesa-equo-psm-iv-exm-equo" => "PSM-Entesa",
    "partido-andalucista-pa" => "PA",
    "partido-animalista-pacma" => "PACMA",
    "esca-os-en-blanco-eb" => "Eb",
    "otros" => "Otros",
);

$colors2011 = array();

foreach (array_keys($parties2011) as $party){
    $colors2011[$party] = random_color();

}

$colors2011["partido-popular-pp"]     = "019ee5";
$colors2011["partido-socialista-obrero-espa-ol-psoe"] = "d41d05";
$colors2011["izquierda-unida-los-verdes-iu-lv"] = "016e52";
$colors2011["converg-egrave-ncia-i-uni-oacute-ciu"]     = "000e62";
$colors2011["uni-oacute-n-progreso-y-democracia-upyd"]     = "e4007b";
$colors2011["euzko-alderdi-jeltzalea-partido-nacionalista-vasco-eaj-pnv"]     = "b2bb1e";
$colors2011["esquerra-republicana-de-catalunya-erc-ri-cat"]     = "e5aa01";
$colors2011["bloque-nacionalista-galego-bng"]     = "b4d0e7";
$colors2011["coalici-oacute-n-canaria-nueva-canarias-cc-nc-pnc"]     = "ffec01";
$colors2011["coalici-oacute-n-canaria-nueva-canarias-cc-nc-pnc"]     = "ffec01";
$colors2011["amaiur-amaiur"]     = "20576E";
$colors2011["geroa-bai-gbai"]     = "D22F10";
$colors2011["equo-equo"]     = "01A29C";
$colors2011["bloc-iniciativa-verds-equo-coalici-oacute-comprom-iacute-s-comprom-iacute-s-q"]     = "E24812";
$colors2011["foro-de-ciudadanos-fac"]     = "003583";
$colors2011["plataforma-per-catalunya-pxc"]     = "F49900";
$colors2011["partido-regionalista-de-cantabria-prc"]     = "C0C516";
$colors2011["psm-iniciativaverds-entesa-equo-psm-iv-exm-equo"]     = "9FAA27";
$colors2011["partido-andalucista-pa"]     = "1F6137";
$colors2011["partido-animalista-pacma"]     = "7F9107";
$colors2011["esca-os-en-blanco-eb"]     = "EEEEEE";
$colors2011["otros"]     = "555555";
