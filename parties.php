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
