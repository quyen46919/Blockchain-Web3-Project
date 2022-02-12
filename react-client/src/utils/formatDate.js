export const formatDate = (date) => {
    var covertDate = date.toString().split('-');
    return covertDate[2].toString().slice(0, 2) + '/' + covertDate[1] + '/' + covertDate[0];
};