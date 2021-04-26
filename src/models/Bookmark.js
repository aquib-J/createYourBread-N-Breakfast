
module.exports=(queryInterface,DataTypes)=>{
    const bookmark=queryInterface.define("bookmark",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        listingId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        userId:{
            type:DataTypes.NUMBER,
            allowNull:true,
        }
    },{
        timestamps:true,
        paranoid:true,
    });

    bookmark.associate=function(models){
        this.hasOne(models.listing);
        this.belongsTo(models.user);
    }

    return bookmark;
}