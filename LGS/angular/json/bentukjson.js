
        var products = data.ArrayProduct;
        var bentukproduct = [];
        _.each(products, function(results) 
        {
            var product = {};
            product.id          = results.id;
            product.nama        = results.nama;
            product.imageName   = results.imageName;
            product.slug        = results.slug;
            product.harga       = results.defaultPrice;
            product.properties  = [];
            product.properties.push(
                                    { name:"Category", value: results.productCategory.categoryName},
                                    { name:"Brand", value: results.productBrand.brandName},
                                    { name:"Supliers", value: results.productSupliers.nama});
            bentukproduct.push(product); 
        });

        $scope.products = bentukproduct;
        var products = bentukproduct;
        var filters = [];

        _.each(products, function(product) 
        {
          _.each(product.properties, function(property) 
          {      
            var existingFilter = _.findWhere(filters, { name: property.name });

            if (existingFilter) 
            {
              var existingOption = _.findWhere(existingFilter.options, { value: property.value });
              if (existingOption) 
              {
                existingOption.count += 1;
              } 
              else 
              {
                existingFilter.options.push({ value: property.value, count: 1 }); 
              }   
            } 
            else 
            {
              var filter = {};
              filter.name = property.name;

              filter.options = [];
              filter.options.push({ value: property.value, count: 1 });
              
              filters.push(filter);      
            }   
          });
        });
        $scope.Filters = filters;
