const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
    const listing=queryInterface.define('listing',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
        },
        hostId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        pricePerDay:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        miscCostPercentage:{
            type:DataTypes.DATE,
            allowNull:,
            default:
        },
        address:{
            type:DataTypes.String,
            allowNull:,
            default:
        },
        description:{
            type:,
            default:,
        },
        cityId:{
            type:,
            default:,
        },
        avgRating:{
            type:DataTypes.NUMBER,
            allowNull:false,
        },
        features:{
            type:DataTypes.STRING,
            default:"",
        },
        ,createdAt:{
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

    listing.associate=function(models){
        this.hasMany(models.city);
        this.hasMany(models.image);
        this.belongsTo(models.user);
        this.belongsTo(models.bookmark)
    };
    listing.addHook('beforeCreate',obj=>{
        obj.id=getCryptoRandom();
    });

    return listing;
};
