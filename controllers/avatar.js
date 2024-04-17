// Avatar generator - avatar.js

const expressAsyncHandler = require("express-async-handler");
const { createAvatar } = require('@dicebear/avatars');

let rings;

const User = require('../models/userModel')
const Data = require('../models/dataModel');


// GET avatar maker
exports.gen_avatar = expressAsyncHandler(async (req, res, next) => {
    console.log('Lodaing avatar generator...')

    try {

        if (!req.user) {
            console.error('User not authenticated');
            return res.redirect('/auth');
        }

        const angelNamesHebrew = [
            'אֶלְדָּאֵל', 'לָוָיָה', 'יָהֵאל', 'סָגַיָה', 'חַיֵּל', 'מֵיָל',
            'חָזָהֵל', 'מְנָדִיאֵל', 'עוּפִיאֵל', 'וָלֹאדָט', 'יָהַוָה', 'נָאוֹמִיאֵל',
            'חָאמִיאֵל', 'מַשָהַלְיָה', 'עָרִיאֵל', 'אֵצִיאֵל', 'יֵלָחֵל', 'נַחַאלֵל',
            'חֹאמִיהֵל', 'מַיְחָאל', 'עוּרִיאֵל', 'אֵלְדַחֵאל', 'יָלָדָהֵל', 'נַתִיאֵל',
            'חָאזֵלָאל', 'מֵאהִיאֵל', 'עוּפַאלָאל', 'אָרַיַלָאל', 'יָלָאָהֵל', 'נֵהִיאֵל',
            'חַמָחֵאל', 'מִכָּאלָאל', 'פִיאֵלַאל', 'אַנַאֵל', 'יָזְלַאֵל', 'נְעָלָאל',
            'חָרָחֵאל', 'מַנְחָאֵל', 'פַעָמָאֵל', 'אַרַאֵל', 'יְרַחָאֵל', 'נָעָלֵאל',
            'חֵרְמִיאֵל', 'מַנְחָאֵל', 'פַעָמָאֵל', 'אָרַאֵל', 'יְרַחָאֵל', 'נָעָלֵאל',
            'חֵרְמִיאֵל', 'מִיכָאֵל', 'פַרָסַיאֵל', 'אֶקַדֵאל', 'יָאְלָאֵל', 'נְרָמַאֵל',
            'צְבָקָאֵל', 'מִיכָאֵל', 'צְרָפָאֵל', 'אַדְנַאֵל', 'יָאְפָאֵל', 'נָרָאֵל',
            'קְדֹמָאֵל', 'מִיכָאֵל', 'קָדְשָאֵל', 'אִגְמָאֵל', 'יָאְרָאֵל', 'נְרָאֵל',
            'קְרֹמָאֵל', 'מִיכָאֵל', 'רָחְמָאֵל', 'אֵגִיאֵל', 'יָאְרָאֵל', 'נְרָאֵל',
            'שְׁטַנְיָאֵל', 'מִיכָאֵל', 'רָפְאָאֵל', 'אֵנָאֵל', 'יָאְרָאֵל', 'נְרָאֵל',
            'תְכָאֵל', 'מִיכָאֵל', 'תְכָאֵל'
        ];

        const angelNamesEnglish = [
            'Eldael', 'Laviah', 'Yahel', 'Sagayah', 'Chaiel', 'Meiyal', 'Chazahel', 'Mendiael', 'Uphiel', 'Walodat', 'Yahavah', 'Naomiel', 'Chamiel', 'Mashahalyah',
            'Ariel', 'Etsiyel', 'Yelahel', 'Nachael', 'Choamiel', 'Meihael', 'Uriel', 'Eldachel', 'Yaladahel', 'Natiel', 'Hazaelael', 'Mehihael', 'Uphalael',
            'Arayael', 'Yalaahel', 'Nehiiel', 'Chamahael', 'Mikhael', 'Piyael', 'Anael', 'Yazlael', 'Nealael', 'Charchael', 'Manchael', 'Paamael',
            'Arael', 'Yerachhael', 'Naalael', 'Chermiel', 'Manchael', 'Paamael', 'Arael', 'Yerachhael', 'Naalael', 'Chermiel', 'Mikhael', 'Parsiael',
            'Eqedael', 'Yaelael', 'Neramael', 'Tzevaqael', 'Mikhael', 'Tzrafaael', 'Adnaael', 'Yafaael', 'Naraael', 'Kdomael', 'Mikhael', 'Kdashael',
            'Igmaael', 'Yaraael', 'Nraael', 'Kromael', 'Mikhael', 'Rachmaael', 'Egiael', 'Yaraael', 'Nraael', 'Shtanyaael', 'Mikhael', 'Rafael',
            'Enaael', 'Yaraael', 'Nraael', 'Tekael', 'Mikhael', 'Tekael'
        ];

        const goeticEntities = [
            'King Baal', 'Duke Agares', 'Prince Vassago', 'Marquis Samigina', 'President Marbas', 'Duke Valefor', 'Marquis Aamon', 'Duke Barbatos', 'King Paimon', 'President Buer',
            'Duke Gusion', 'Prince Sitri', 'King Beleth', 'Marquis Leraje', 'Duke Eligos', 'Duke Zepar', 'Count Botis', 'Duke Bathin', 'Duke Sallos', 'King Purson',
            'Count Marax', 'Count Ipos', 'Duke Aim', 'Marquis Naberius', 'Count Glasya-Labolas', 'Duke Bune', 'Marquis Ronove', 'Duke Berith', 'Duke Astaroth', 'Marquis Forneus',
            'President Foras', 'King Asmoday', 'Prince Gaap', 'Count Furfur', 'Marquis Marchosias', 'Prince Stolas', 'Marquis Phenex', 'Count Halphas', 'President Malphas', 'Count Räum',
            'Duke Focalor', 'Duke Vepar', 'Marquis Sabnock', 'Marquis Shax', 'King Vine', 'Count Bifrons', 'Duke Vual', 'President Haagenti', 'Duke Crocell', 'Knight Furcas',
            'King Balam', 'Duke Alloces', 'President Caim', 'Duke Murmur', 'Prince Orobas', 'Duke Gremory', 'President Ose', 'President Amy', 'Marquis Orias', 'Duke Vapula',
            'King Zagan', 'President Valac', 'Marquis Andras', 'Duke Flauros', 'Marquis Andrealphus', 'Marquis Kimaris', 'Duke Amdusias', 'King Belial', 'Marquis Decarabia', 'Prince Seere',
            'Duke Dantalion', 'Count Andromalius'
        ];

        const planets = ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];
        const zodiacs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
        const elements = ['Fire', 'Earth', 'Air', 'Water'];


        const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

        const seedType = Math.random() < 0.2 ? angelNamesEnglish :
                 Math.random() < 0.2 ? angelNamesHebrew :
                 Math.random() < 0.2 ? goeticEntities :
                 Math.random() < 0.2 ? planets :
                 Math.random() < 0.2 ? zodiacs :
                 elements;
        
        const randomSeed = getRandomItem(seedType);  

        let seed = [randomSeed];

            // Load the avatar style dynamically
        if (!rings) {
            const { rings: lodaedRings } = await import('@dicebear/collection');
            rings = lodaedRings;
        }

        console.log('Generating w/seed: ', seed)

        // Generate a DiceBear avatar SVG
        const avatar = createAvatar(rings, {
            seed: seed.join(''), // Convert the array to a string
            // Other options if needed
        });

        // Render the "avatar" pug page with the generated SVG
        res.render('avatar', { title: "Avatar Generation", svg: avatar });
    } catch (error) {
        console.error('Error generating avatar:', error);
        res.status(500).send('Error generating avatar');
    }
});


// POST avatar to user data
exports.post_avatar = expressAsyncHandler(async (req, res, next) => {
    try {

        if (!req.user) {
            console.error('User not authenticated');
            return res.redirect('/auth');
        }

        const userId = req.user._id;
        const userData = await Data.findOne({ user: userId });

        if (!userData) {
            console.error('User data not found');
            return res.status(404).json({ message: 'User data not found' });
        }

        console.log('Request Body:', req.body);
        console.log('SVG data:', req.body.svgData);
        
        userData.avatar = req.body.svgData; 

        // Save the updated user data
        userData.avatar = req.body.svgData;
        await userData.save();

        console.log('Avatar updated successfully', userData.avatar);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error updating avatar:', error);
        res.status(500).send('Error updating avatar');
    }
});

module.exports = {
    gen_avatar: exports.gen_avatar,
    post_avatar: exports.post_avatar
};