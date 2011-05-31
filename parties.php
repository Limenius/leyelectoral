<?
function random_color(){
    $c = '';
    while(strlen($c)<6){
        $c .= sprintf("%02X", mt_rand(0, 255));
    }
    return $c;
}

$parties = array(
    "p-s-o-e" => "P.S.O.E.",
    "p-p" => "P.P.",
    "i-u" => "I.U.",
    "ciu" => "CiU",
    "upyd" => "UPyD",
    "eaj-pnv" => "EAJ-PNV",
    "esquerra" => "ESQUERRA",
    "b-n-g" => "B.N.G.",
    "cc-pnc" => "CC-PNC",
    "ca" => "CA",
    "na-bai" => "NA-BAI",
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
    "unitat-per-les-illes" => "UNITAT PER LES ILLES",
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

$colors["p-s-o-e"] = "aa0000";
$colors["p-p"]     = "0000aa";
