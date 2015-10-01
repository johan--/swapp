function showLoading($ionicLoading) {
    $ionicLoading.show({
        template: 'Loading...'
    });
};

function hideLoading($ionicLoading) {
    $ionicLoading.hide();
};