
module.exports=(queryInterface,DataTypes)=>{
    const state=queryInterface.define("state",{
        id:{
            type:DataTypes.NUMBER,
            primaryKey:true,
        },
        stateName:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        countryId:{
            type:DataTypes.NUMBER,
            allowNull:true,
        }
    },{
        timestamps:true,
        paranoid:true,
    });

    state.associate=function(models){
        this.hasOne(models.country);
        this.hasMany(models.city);
    }

    return state;
}