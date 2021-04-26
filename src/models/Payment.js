module.exports=(queryInterface,DataTypes)=>{
    const payment=queryInterface.define("payment",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        bookingId:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        transactionId:{
            type:DataTypes.NUMBER,
            allowNull:true,
        },
        amount:{
            type:DataTypes.NUMBER,
            allowNull:true,
        },
        paymentStatus:{
            type:DataTypes.NUMBER,
            allowNull:true,
        }
    },{
        timestamps:true,
        paranoid:true,
    });

    payment.associate=function(models){
        this.belongsTo(models.booking);
    }

    return payment;
}