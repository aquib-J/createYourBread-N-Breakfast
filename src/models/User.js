const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
    const user=queryInterface.define('user',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
        },
        firstName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        lastName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        bio:{
            type:DataTypes.DATE,
            allowNull:,
            default:
        },
        email:{
            type:DataTypes.DATE,
            allowNull:,
            default:
        },
        password:{
            type:,
            default:,
        },
        dob:{
            type:,
            default:,
        },
        profilePictureUrl:{
            type:DataTypes.NUMBER,
            allowNull:false,
        },createdAt:{
            type:,
            default:,
        },
        updatedAt:{
            type:,
            default:,
        },
    },{
        timestamps:true,
        paranoid:true,
    });

    user.associate=function(models){
        this.hasMany(models.booking);
        this.hasMany(models.listing);
        this.hasMany(models.bookmark);
        this.hasMany(models.review);
    };
    user.addHook('beforeCreate',obj=>{
        obj.id=getCryptoRandom();
    });

    return user;
};
