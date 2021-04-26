module.exports=(queryInterface,DataTypes)=>{
    const review=queryInterface.define("review",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        bookingId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        description:{
            type:DataTypes.NUMBER,
            allowNull:true,
        },
        rating:{
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

    review.associate=function(models){
        this.belongsTo(models.booking);
        this.belongsTo(models.user);
    }

    return review;
}