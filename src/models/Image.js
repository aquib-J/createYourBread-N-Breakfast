module.exports=(queryInterface,DataTypes)=>{
    const image=queryInterface.define("image",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        entityId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        url:{
            type:DataTypes.NUMBER,
            allowNull:true,
        },
        metadata:{
            type:DataTypes.JSON,
            allowNull:true,
        }
    },{
        timestamps:true,
        paranoid:true,
    });

    image.associate=function(models){
        this.belongsTo(models.listing);
    }

    return image;
}