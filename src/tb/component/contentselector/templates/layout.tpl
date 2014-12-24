<div id="library-pane-wrapper" class="bb5-windowpane-wrapper windowpane-treeview">
    <div class="bb5-windowpane-tree ui-layout-pane ui-layout-west">
        <div class="ui-layout-north">
            <p><strong data-i18n="toolbar.selector.select_folder">Sélectionner une rubrique</strong></p>
        </div>

<div class="inner-center layout-overflow-scroll">
  <div class="bb5-windowpane-tree-inner">
    <!-- tree pane: tree wrapper -->
    <div class="bb5-windowpane-treewrapper">

        <div class="bb5-windowpane-treewrapper-inner jstree jstree-3 jstree-focused jstree-bb5">
          <div class="bb5-treeview">
          </div>
        </div>
    </div>
    <!-- end tree pane: tree wrapper -->
  </div>
</div><!--/.inner-center-->

<div class="ui-layout-south">
</div><!--/.ui-layout-south-->
    </div>

    <div class="bb5-windowpane-main ui-layout-pane ui-layout-center">
      <div class="ui-layout-north">
        <div class="bb5-form-wrapper">
          <div class="row">
            <div class="col-bb5-x">
              <div class="row form-group"><span class="col-md
  col-sm-6"><label class="sr-only" for="form10">Titre</label><input id="form10" type="text" placeholder="Titre" class="form-control input-xs"></span> <span class="col-bb5-x pull-right bb5-query-results">Article - 593 éléments</span></div>

              <div class="row form-group">
                <div class="col-bb5-x">Publication avant le : </div>
                <div class="col-bb5-22"><div class="input-group input-group-xs"><input type="text" placeholder="dd/mm/aaaa" class="form-control input-xs bb5-datepicker"><span class="input-group-btn"><button type="button" class="btn btn-default"><i class="fa fa-calendar"></i></button></span></div></div>
                <div class="col-bb5-x">Après le : </div>
                <div class="col-bb5-22"><div class="input-group input-group-xs"><input type="text" placeholder="dd/mm/aaaa" class="form-control input-xs bb5-datepicker"><span class="input-group-btn"><button type="button" class="btn btn-default"><i class="fa fa-calendar"></i></button></span></div></div>
                <div class="col-bb5-x pull-right"><button type="button" class="btn btn-default btn-xs"><i class="fa fa-search"></i> Rechercher</button></div>
              </div>
            </div>

          </div>
        </div><!--/.form-wrapper-->
        <div class="row">
          <div class="col-bb5-100">
            <p class="bb5-widget-toolbar result-infos"></p>
            <div class="bb5-widget-toolbar list-options clearfix">
              <ul class="pagination content-selection-pagination clearfix"></ul>
              <p class="pull-right">
                <button type="button" data-viewmode="grid" class="btn viewmode-btn btn-simple btn-sm bb5-sortasgrid fa fa-th-large"></button>
                <button type="button" data-viewmode="list" class="btn viewmode-btn btn-simple btn-sm bb5-sortaslist fa fa-list-ul"></button>
                <select class="max-per-page-selector input-xs"></select>
              </p>
            </div>
          </div>
        </div>
      </div><!--/.ui-layout-north-->

      <div class="inner-center layout-overflow-scroll data-list-ctn"></div><!--/.inner-center-->

    </div>
  </div>
