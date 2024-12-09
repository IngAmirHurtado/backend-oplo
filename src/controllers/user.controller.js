import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';


export const getUserResults = async (req, res ) => {
    const { search} = req.params;
    const userId = req.user._id;

    const users = await User.find({
        username: { $regex: search, $options: 'i' }, // Coincidencia parcial con insensibilidad
        _id: { $ne: userId }, // Exclusión de un usuario específico
      }).select('username email _id profilePic createdAt updatedAt following followers');

    res.status(200).json(users);
}

export const randomSuggestion = async (req, res) => {
    const user = req.user;

    const randomUser = await User.aggregate([
        { $match: { _id: { $ne: user._id } } },  // Correcta forma de usar $ne dentro de $match
        { $sample: { size: 3 } }  // Obtiene 3 documentos aleatorios
    ])

    res.status(200).json(randomUser);
}


export const updateGeneralInfo = async (req, res) => {
    const {username, email} = req.body;
    const user = req.user;

    if(!username || !email) return res.status(400).json({ message: 'Todos los campos son requeridos' });

    const usernameExist = await User.findOne({username});
    if(usernameExist && usernameExist.id !== user.id) return res.status(400).json({ message: 'Este nombre de usuario ya está en uso' });

    const updateUser = await User.findByIdAndUpdate(user.id, {username, email}, {new: true});

    res.status(200).json(updateUser);

}


export const updateProfilePic = async (req, res) => {
    const { profilePic } = req.body;
    const user = req.user;

    if (!profilePic) {
        return res.status(400).json({ message: 'La imagen es requerida' });
    }

    try {
        // Subir la nueva imagen
        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        // Destruir la imagen anterior si existe
        if (user.profilePic) {
            // Extraer public_id si solo tienes la URL
            const publicId = extractPublicId(user.profilePic);
            await cloudinary.uploader.destroy(publicId);
        }

        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { profilePic: uploadResponse.secure_url },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la foto de perfil', error });
    }
};

// Función para extraer el public_id de la URL de Cloudinary
function extractPublicId(url) {
    const parts = url.split('/');
    const fileName = parts.pop().split('.')[0]; // Elimina la extensión (e.g., .jpg, .png)
    return `${parts.slice(-2).join('/')}/${fileName}`; // Ajusta según la estructura de tus URLs
}