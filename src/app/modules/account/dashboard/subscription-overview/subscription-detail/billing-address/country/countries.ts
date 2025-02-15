

export const _filter = (opt: string[], value: string): string[] => {
    const filterValue = value.toLowerCase();

    return opt.filter(item => item.toLowerCase().includes(filterValue));
};

export interface Country {
    code: string;
    nameDE: string;
    nameEN: string;
}

export const countries: Country[] = [
    { code: 'AF', nameDE: 'Afghanistan', nameEN: 'Afghanistan' },
    { code: 'EG', nameDE: 'Ägypten', nameEN: 'Egypt' },
    { code: 'AX', nameDE: 'Ålandinseln', nameEN: 'Åland Islands' },
    { code: 'AL', nameDE: 'Albanien', nameEN: 'Albania' },
    { code: 'DZ', nameDE: 'Algerien', nameEN: 'Algeria' },
    { code: 'AD', nameDE: 'Andorra', nameEN: 'Andorra' },
    { code: 'AO', nameDE: 'Angola', nameEN: 'Angola' },
    { code: 'AI', nameDE: 'Anguilla', nameEN: 'Anguilla' },
    { code: 'AQ', nameDE: 'Antarktis', nameEN: 'Antarctica' },
    { code: 'AG', nameDE: 'Antigua und Barbuda', nameEN: 'Antigua and Barbuda' },
    { code: 'GQ', nameDE: 'Äquatorialguinea', nameEN: 'Equatorial Guinea' },
    { code: 'AR', nameDE: 'Argentinien', nameEN: 'Argentina' },
    { code: 'AM', nameDE: 'Armenien', nameEN: 'Armenia' },
    { code: 'AW', nameDE: 'Aruba', nameEN: 'Aruba' },
    { code: 'AC', nameDE: 'Ascension', nameEN: 'Ascension Island' },
    { code: 'AZ', nameDE: 'Aserbaidschan', nameEN: 'Azerbaijan' },
    { code: 'ET', nameDE: 'Äthiopien', nameEN: 'Ethiopia' },
    { code: 'AU', nameDE: 'Australien', nameEN: 'Australia' },
    { code: 'BS', nameDE: 'Bahamas', nameEN: 'Bahamas' },
    { code: 'BH', nameDE: 'Bahrain', nameEN: 'Bahrain' },
    { code: 'BD', nameDE: 'Bangladesch', nameEN: 'Bangladesh' },
    { code: 'BB', nameDE: 'Barbados', nameEN: 'Barbados' },
    { code: 'BY', nameDE: 'Belarus', nameEN: 'Belarus' },
    { code: 'BE', nameDE: 'Belgien', nameEN: 'Belgium' },
    { code: 'BZ', nameDE: 'Belize', nameEN: 'Belize' },
    { code: 'BJ', nameDE: 'Benin', nameEN: 'Benin' },
    { code: 'BM', nameDE: 'Bermuda', nameEN: 'Bermuda' },
    { code: 'BT', nameDE: 'Bhutan', nameEN: 'Bhutan' },
    { code: 'BO', nameDE: 'Bolivien', nameEN: 'Bolivia' },
    { code: 'BA', nameDE: 'Bosnien und Herzegowina', nameEN: 'Bosnia and Herzegovina' },
    { code: 'BW', nameDE: 'Botsuana', nameEN: 'Botswana' },
    { code: 'BV', nameDE: 'Bouvetinsel', nameEN: 'Bouvet Island' },
    { code: 'BR', nameDE: 'Brasilien', nameEN: 'Brazil' },
    { code: 'VG', nameDE: 'Britische Jungferninseln', nameEN: 'British Virgin Islands' },
    { code: 'IO', nameDE: 'Britisches Territorium im Indischen Ozean', nameEN: 'British Indian Ocean Territory' },
    { code: 'BN', nameDE: 'Brunei Darussalam', nameEN: 'Brunei' },
    { code: 'BG', nameDE: 'Bulgarien', nameEN: 'Bulgaria' },
    { code: 'BF', nameDE: 'Burkina Faso', nameEN: 'Burkina Faso' },
    { code: 'BI', nameDE: 'Burundi', nameEN: 'Burundi' },
    { code: 'CV', nameDE: 'Cabo Verde', nameEN: 'Cape Verde' },
    { code: 'CL', nameDE: 'Chile', nameEN: 'Chile' },
    { code: 'CN', nameDE: 'China', nameEN: 'China' },
    { code: 'CK', nameDE: 'Cookinseln', nameEN: 'Cook Islands' },
    { code: 'CR', nameDE: 'Costa Rica', nameEN: 'Costa Rica' },
    { code: 'CI', nameDE: 'Côte d’Ivoire', nameEN: 'Ivory Coast' },
    { code: 'CW', nameDE: 'Curaçao', nameEN: 'Curaçao' },
    { code: 'DK', nameDE: 'Dänemark', nameEN: 'Denmark' },
    { code: 'DE', nameDE: 'Deutschland', nameEN: 'Germany' },
    { code: 'DM', nameDE: 'Dominica', nameEN: 'Dominica' },
    { code: 'DO', nameDE: 'Dominikanische Republik', nameEN: 'Dominican Republic' },
    { code: 'DJ', nameDE: 'Dschibuti', nameEN: 'Djibouti' },
    { code: 'EC', nameDE: 'Ecuador', nameEN: 'Ecuador' },
    { code: 'SV', nameDE: 'El Salvador', nameEN: 'El Salvador' },
    { code: 'ER', nameDE: 'Eritrea', nameEN: 'Eritrea' },
    { code: 'EE', nameDE: 'Estland', nameEN: 'Estonia' },
    { code: 'SZ', nameDE: 'Eswatini', nameEN: 'Eswatini' },
    { code: 'FK', nameDE: 'Falklandinseln', nameEN: 'Falkland Islands' },
    { code: 'FO', nameDE: 'Färöer', nameEN: 'Faroe Islands' },
    { code: 'FJ', nameDE: 'Fidschi', nameEN: 'Fiji' },
    { code: 'FI', nameDE: 'Finnland', nameEN: 'Finland' },
    { code: 'FR', nameDE: 'Frankreich', nameEN: 'France' },
    { code: 'GF', nameDE: 'Französisch-Guayana', nameEN: 'French Guiana' },
    { code: 'PF', nameDE: 'Französisch-Polynesien', nameEN: 'French Polynesia' },
    { code: 'TF', nameDE: 'Französische Süd- und Antarktisgebiete', nameEN: 'French Southern Territories' },
    { code: 'GA', nameDE: 'Gabun', nameEN: 'Gabon' },
    { code: 'GM', nameDE: 'Gambia', nameEN: 'Gambia' },
    { code: 'GE', nameDE: 'Georgien', nameEN: 'Georgia' },
    { code: 'GH', nameDE: 'Ghana', nameEN: 'Ghana' },
    { code: 'GI', nameDE: 'Gibraltar', nameEN: 'Gibraltar' },
    { code: 'GD', nameDE: 'Grenada', nameEN: 'Grenada' },
    { code: 'GR', nameDE: 'Griechenland', nameEN: 'Greece' },
    { code: 'GL', nameDE: 'Grönland', nameEN: 'Greenland' },
    { code: 'GP', nameDE: 'Guadeloupe', nameEN: 'Guadeloupe' },
    { code: 'GU', nameDE: 'Guam', nameEN: 'Guam' },
    { code: 'GT', nameDE: 'Guatemala', nameEN: 'Guatemala' },
    { code: 'GG', nameDE: 'Guernsey', nameEN: 'Guernsey' },
    { code: 'GN', nameDE: 'Guinea', nameEN: 'Guinea' },
    { code: 'GW', nameDE: 'Guinea-Bissau', nameEN: 'Guinea-Bissau' },
    { code: 'GY', nameDE: 'Guyana', nameEN: 'Guyana' },
    { code: 'HT', nameDE: 'Haiti', nameEN: 'Haiti' },
    { code: 'HN', nameDE: 'Honduras', nameEN: 'Honduras' },
    { code: 'IN', nameDE: 'Indien', nameEN: 'India' },
    { code: 'ID', nameDE: 'Indonesien', nameEN: 'Indonesia' },
    { code: 'IQ', nameDE: 'Irak', nameEN: 'Iraq' },
    { code: 'IE', nameDE: 'Irland', nameEN: 'Ireland' },
    { code: 'IS', nameDE: 'Island', nameEN: 'Iceland' },
    { code: 'IM', nameDE: 'Isle of Man', nameEN: 'Isle of Man' },
    { code: 'IL', nameDE: 'Israel', nameEN: 'Israel' },
    { code: 'IT', nameDE: 'Italien', nameEN: 'Italy' },
    { code: 'JM', nameDE: 'Jamaika', nameEN: 'Jamaica' },
    { code: 'JP', nameDE: 'Japan', nameEN: 'Japan' },
    { code: 'YE', nameDE: 'Jemen', nameEN: 'Yemen' },
    { code: 'JE', nameDE: 'Jersey', nameEN: 'Jersey' },
    { code: 'JO', nameDE: 'Jordanien', nameEN: 'Jordan' },
    { code: 'KY', nameDE: 'Kaimaninseln', nameEN: 'Cayman Islands' },
    { code: 'KH', nameDE: 'Kambodscha', nameEN: 'Cambodia' },
    { code: 'CM', nameDE: 'Kamerun', nameEN: 'Cameroon' },
    { code: 'CA', nameDE: 'Kanada', nameEN: 'Canada' },
    { code: 'BQ', nameDE: 'Karibische Niederlande', nameEN: 'Caribbean Netherlands' },
    { code: 'KZ', nameDE: 'Kasachstan', nameEN: 'Kazakhstan' },
    { code: 'QA', nameDE: 'Katar', nameEN: 'Qatar' },
    { code: 'KE', nameDE: 'Kenia', nameEN: 'Kenya' },
    { code: 'KG', nameDE: 'Kirgisistan', nameEN: 'Kyrgyzstan' },
    { code: 'KI', nameDE: 'Kiribati', nameEN: 'Kiribati' },
    { code: 'CO', nameDE: 'Kolumbien', nameEN: 'Colombia' },
    { code: 'KM', nameDE: 'Komoren', nameEN: 'Comoros' },
    { code: 'CG', nameDE: 'Kongo-Brazzaville', nameEN: 'Congo-Brazzaville' },
    { code: 'CD', nameDE: 'Kongo-Kinshasa', nameEN: 'Congo-Kinshasa' },
    { code: 'XK', nameDE: 'Kosovo', nameEN: 'Kosovo' },
    { code: 'HR', nameDE: 'Kroatien', nameEN: 'Croatia' },
    { code: 'KW', nameDE: 'Kuwait', nameEN: 'Kuwait' },
    { code: 'LA', nameDE: 'Laos', nameEN: 'Laos' },
    { code: 'LS', nameDE: 'Lesotho', nameEN: 'Lesotho' },
    { code: 'LV', nameDE: 'Lettland', nameEN: 'Latvia' },
    { code: 'LB', nameDE: 'Libanon', nameEN: 'Lebanon' },
    { code: 'LR', nameDE: 'Liberia', nameEN: 'Liberia' },
    { code: 'LY', nameDE: 'Libyen', nameEN: 'Libya' },
    { code: 'LI', nameDE: 'Liechtenstein', nameEN: 'Liechtenstein' },
    { code: 'LT', nameDE: 'Litauen', nameEN: 'Lithuania' },
    { code: 'LU', nameDE: 'Luxemburg', nameEN: 'Luxembourg' },
    { code: 'MG', nameDE: 'Madagaskar', nameEN: 'Madagascar' },
    { code: 'MW', nameDE: 'Malawi', nameEN: 'Malawi' },
    { code: 'MY', nameDE: 'Malaysia', nameEN: 'Malaysia' },
    { code: 'MV', nameDE: 'Malediven', nameEN: 'Maldives' },
    { code: 'ML', nameDE: 'Mali', nameEN: 'Mali' },
    { code: 'MT', nameDE: 'Malta', nameEN: 'Malta' },
    { code: 'MA', nameDE: 'Marokko', nameEN: 'Morocco' },
    { code: 'MQ', nameDE: 'Martinique', nameEN: 'Martinique' },
    { code: 'MR', nameDE: 'Mauretanien', nameEN: 'Mauritania' },
    { code: 'MU', nameDE: 'Mauritius', nameEN: 'Mauritius' },
    { code: 'YT', nameDE: 'Mayotte', nameEN: 'Mayotte' },
    { code: 'MX', nameDE: 'Mexiko', nameEN: 'Mexico' },
    { code: 'MC', nameDE: 'Monaco', nameEN: 'Monaco' },
    { code: 'MN', nameDE: 'Mongolei', nameEN: 'Mongolia' },
    { code: 'ME', nameDE: 'Montenegro', nameEN: 'Montenegro' },
    { code: 'MS', nameDE: 'Montserrat', nameEN: 'Montserrat' },
    { code: 'MZ', nameDE: 'Mosambik', nameEN: 'Mozambique' },
    { code: 'MM', nameDE: 'Myanmar', nameEN: 'Myanmar' },
    { code: 'NA', nameDE: 'Namibia', nameEN: 'Namibia' },
    { code: 'NR', nameDE: 'Nauru', nameEN: 'Nauru' },
    { code: 'NP', nameDE: 'Nepal', nameEN: 'Nepal' },
    { code: 'NC', nameDE: 'Neukaledonien', nameEN: 'New Caledonia' },
    { code: 'NZ', nameDE: 'Neuseeland', nameEN: 'New Zealand' },
    { code: 'NI', nameDE: 'Nicaragua', nameEN: 'Nicaragua' },
    { code: 'NL', nameDE: 'Niederlande', nameEN: 'Netherlands' },
    { code: 'NE', nameDE: 'Niger', nameEN: 'Niger' },
    { code: 'NG', nameDE: 'Nigeria', nameEN: 'Nigeria' },
    { code: 'NU', nameDE: 'Niue', nameEN: 'Niue' },
    { code: 'MK', nameDE: 'Nordmazedonien', nameEN: 'North Macedonia' },
    { code: 'NO', nameDE: 'Norwegen', nameEN: 'Norway' },
    { code: 'OM', nameDE: 'Oman', nameEN: 'Oman' },
    { code: 'AT', nameDE: 'Österreich', nameEN: 'Austria' },
    { code: 'PK', nameDE: 'Pakistan', nameEN: 'Pakistan' },
    { code: 'PS', nameDE: 'Palästinensische Autonomiegebiete', nameEN: 'Palestinian Territories' },
    { code: 'PA', nameDE: 'Panama', nameEN: 'Panama' },
    { code: 'PG', nameDE: 'Papua-Neuguinea', nameEN: 'Papua New Guinea' },
    { code: 'PY', nameDE: 'Paraguay', nameEN: 'Paraguay' },
    { code: 'PE', nameDE: 'Peru', nameEN: 'Peru' },
    { code: 'PH', nameDE: 'Philippinen', nameEN: 'Philippines' },
    { code: 'PN', nameDE: 'Pitcairninseln', nameEN: 'Pitcairn Islands' },
    { code: 'PL', nameDE: 'Polen', nameEN: 'Poland' },
    { code: 'PT', nameDE: 'Portugal', nameEN: 'Portugal' },
    { code: 'PR', nameDE: 'Puerto Rico', nameEN: 'Puerto Rico' },
    { code: 'MD', nameDE: 'Republik Moldau', nameEN: 'Moldova' },
    { code: 'RE', nameDE: 'Réunion', nameEN: 'Réunion' },
    { code: 'RW', nameDE: 'Ruanda', nameEN: 'Rwanda' },
    { code: 'RO', nameDE: 'Rumänien', nameEN: 'Romania' },
    { code: 'RU', nameDE: 'Russland', nameEN: 'Russia' },
    { code: 'SB', nameDE: 'Salomonen', nameEN: 'Solomon Islands' },
    { code: 'ZM', nameDE: 'Sambia', nameEN: 'Zambia' },
    { code: 'WS', nameDE: 'Samoa', nameEN: 'Samoa' },
    { code: 'SM', nameDE: 'San Marino', nameEN: 'San Marino' },
    { code: 'ST', nameDE: 'São Tomé und Príncipe', nameEN: 'São Tomé and Príncipe' },
    { code: 'SA', nameDE: 'Saudi-Arabien', nameEN: 'Saudi Arabia' },
    { code: 'SE', nameDE: 'Schweden', nameEN: 'Sweden' },
    { code: 'CH', nameDE: 'Schweiz', nameEN: 'Switzerland' },
    { code: 'SN', nameDE: 'Senegal', nameEN: 'Senegal' },
    { code: 'RS', nameDE: 'Serbien', nameEN: 'Serbia' },
    { code: 'SC', nameDE: 'Seychellen', nameEN: 'Seychelles' },
    { code: 'SL', nameDE: 'Sierra Leone', nameEN: 'Sierra Leone' },
    { code: 'ZW', nameDE: 'Simbabwe', nameEN: 'Zimbabwe' },
    { code: 'SG', nameDE: 'Singapur', nameEN: 'Singapore' },
    { code: 'SX', nameDE: 'Sint Maarten', nameEN: 'Sint Maarten' },
    { code: 'SK', nameDE: 'Slowakei', nameEN: 'Slovakia' },
    { code: 'SI', nameDE: 'Slowenien', nameEN: 'Slovenia' },
    { code: 'SO', nameDE: 'Somalia', nameEN: 'Somalia' },
    { code: 'HK', nameDE: 'Sonderverwaltungsregion Hongkong', nameEN: 'Hong Kong SAR' },
    { code: 'MO', nameDE: 'Sonderverwaltungsregion Macau', nameEN: 'Macau SAR' },
    { code: 'ES', nameDE: 'Spanien', nameEN: 'Spain' },
    { code: 'SJ', nameDE: 'Spitzbergen und Jan Mayen', nameEN: 'Svalbard and Jan Mayen' },
    { code: 'LK', nameDE: 'Sri Lanka', nameEN: 'Sri Lanka' },
    { code: 'BL', nameDE: 'St. Barthélemy', nameEN: 'Saint Barthélemy' },
    { code: 'SH', nameDE: 'St. Helena', nameEN: 'Saint Helena' },
    { code: 'KN', nameDE: 'St. Kitts und Nevis', nameEN: 'Saint Kitts and Nevis' },
    { code: 'LC', nameDE: 'St. Lucia', nameEN: 'Saint Lucia' },
    { code: 'MF', nameDE: 'St. Martin', nameEN: 'Saint Martin' },
    { code: 'PM', nameDE: 'St. Pierre und Miquelon', nameEN: 'Saint Pierre and Miquelon' },
    { code: 'VC', nameDE: 'St. Vincent und die Grenadinen', nameEN: 'Saint Vincent and the Grenadines' },
    { code: 'ZA', nameDE: 'Südafrika', nameEN: 'South Africa' },
    { code: 'SD', nameDE: 'Sudan', nameEN: 'Sudan' },
    { code: 'GS', nameDE: 'Südgeorgien und die Südlichen Sandwichinseln', nameEN: 'South Georgia and the South Sandwich Islands' },
    { code: 'KR', nameDE: 'Südkorea', nameEN: 'South Korea' },
    { code: 'SS', nameDE: 'Südsudan', nameEN: 'South Sudan' },
    { code: 'SR', nameDE: 'Suriname', nameEN: 'Suriname' },
    { code: 'TJ', nameDE: 'Tadschikistan', nameEN: 'Tajikistan' },
    { code: 'TW', nameDE: 'Taiwan', nameEN: 'Taiwan' },
    { code: 'TZ', nameDE: 'Tansania', nameEN: 'Tanzania' },
    { code: 'TH', nameDE: 'Thailand', nameEN: 'Thailand' },
    { code: 'TL', nameDE: 'Timor-Leste', nameEN: 'Timor-Leste' },
    { code: 'TG', nameDE: 'Togo', nameEN: 'Togo' },
    { code: 'TK', nameDE: 'Tokelau', nameEN: 'Tokelau' },
    { code: 'TO', nameDE: 'Tonga', nameEN: 'Tonga' },
    { code: 'TT', nameDE: 'Trinidad und Tobago', nameEN: 'Trinidad and Tobago' },
    { code: 'TA', nameDE: 'Tristan da Cunha', nameEN: 'Tristan da Cunha' },
    { code: 'TD', nameDE: 'Tschad', nameEN: 'Chad' },
    { code: 'CZ', nameDE: 'Tschechien', nameEN: 'Czech Republic' },
    { code: 'TN', nameDE: 'Tunesien', nameEN: 'Tunisia' },
    { code: 'TR', nameDE: 'Türkei', nameEN: 'Turkey' },
    { code: 'TM', nameDE: 'Turkmenistan', nameEN: 'Turkmenistan' },
    { code: 'TC', nameDE: 'Turks- und Caicosinseln', nameEN: 'Turks and Caicos Islands' },
    { code: 'TV', nameDE: 'Tuvalu', nameEN: 'Tuvalu' },
    { code: 'UG', nameDE: 'Uganda', nameEN: 'Uganda' },
    { code: 'UA', nameDE: 'Ukraine', nameEN: 'Ukraine' },
    { code: 'HU', nameDE: 'Ungarn', nameEN: 'Hungary' },
    { code: 'UY', nameDE: 'Uruguay', nameEN: 'Uruguay' },
    { code: 'UZ', nameDE: 'Usbekistan', nameEN: 'Uzbekistan' },
    { code: 'VU', nameDE: 'Vanuatu', nameEN: 'Vanuatu' },
    { code: 'VA', nameDE: 'Vatikanstadt', nameEN: 'Vatican City' },
    { code: 'VE', nameDE: 'Venezuela', nameEN: 'Venezuela' },
    { code: 'AE', nameDE: 'Vereinigte Arabische Emirate', nameEN: 'United Arab Emirates' },
    { code: 'US', nameDE: 'Vereinigte Staaten', nameEN: 'United States' },
    { code: 'GB', nameDE: 'Vereinigtes Königreich', nameEN: 'United Kingdom' },
    { code: 'VN', nameDE: 'Vietnam', nameEN: 'Vietnam' },
    { code: 'WF', nameDE: 'Wallis und Futuna', nameEN: 'Wallis and Futuna' },
    { code: 'EH', nameDE: 'Westsahara', nameEN: 'Western Sahara' },
    { code: 'CF', nameDE: 'Zentralafrikanische Republik', nameEN: 'Central African Republic' },
    { code: 'CY', nameDE: 'Zypern', nameEN: 'Cyprus' }
];