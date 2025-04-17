const getCategoryKey = () =>  ['categories']
const getMyAdsKey = (role, page) => ['myAds', role, page]
const getMyAdsWithoutPageKey = () => ['myAds']
const getBrandAds = (page,category,search) => ['brandAds', page, category, search]
const getInfluencerAds = (page, search, filters) => ['influencerAds', page, search, filters]
const getAdById = (adId) => ['ad', adId]
const getProfileKey = () => ["profileInfo"]
const getAllChatsKey = () => ['chats']
const getChatKey = (recipientId) => ['chat', recipientId]
const getMessageKey = (chatId) => ['messages', chatId]
const getChatCardKey = (userId) => ['chatCard', userId]
const getProfileByIdKey = (userId) => ['profile', userId]

const queryKeys = {
    getCategoryKey,
    getMyAdsKey,
    getMyAdsWithoutPageKey,
    getBrandAds,
    getInfluencerAds,
    getAdById,
    getProfileKey,
    getAllChatsKey,
    getChatKey,
    getMessageKey,
    getChatCardKey,
    getProfileByIdKey
};

export default queryKeys;
