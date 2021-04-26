const { getCryptoRandom } = require('../utils').utilityMethods;

module.exports = (queryInterface, DataTypes) => {
    const booking=queryInterface.define('booking',{
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
        },
        userId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        listingId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        checkinDate:{
            type:DataTypes.DATE,
            allowNull:,
            default:
        },
        checkOutDate:{
            type:DataTypes.DATE,
            allowNull:,
            default:
        },
        createdAt:{
            type:,
            default:,
        },
        updatedAt:{
            type:,
            default:,
        },
        totalPrice:{
            type:DataTypes.NUMBER,
            allowNull:false,
        },
    },{
        timestamps:true,
        paranoid:true,
    });

    booking.associate=function(models){
        this.hasMany(models.review);
        this.hasOne(models.user);
        this.hasOne(models.listing);
        this.hasOne(models.payment);
    };
    booking.addHook('beforeCreate',obj=>{
        obj.id=getCryptoRandom();
    });

    return booking;
};
